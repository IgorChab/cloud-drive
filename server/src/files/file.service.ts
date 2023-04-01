import {Injectable, BadRequestException, ForbiddenException, ConsoleLogger} from "@nestjs/common";
import * as fs from 'fs'
import * as path from 'path'
import {Model} from "mongoose";
import {File, FileDocument} from "../models/file.model";
import {User, UserDocument} from "../models/user.model";
import {FileCreationDto} from "../dto/file.dto";
import {InjectModel} from "@nestjs/mongoose";
import {FolderDto} from "../dto/folder.dto";
import {v4 as uuidv4 } from 'uuid'
import * as archiver from 'archiver'

@Injectable()
export class FileService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(File.name) private fileModel: Model<FileDocument, FileCreationDto>
    ) {}

    createDrive(userID: string){
        const rootPath = path.join(__dirname, '../..', 'storage', `${userID}`)
        this.fileModel.create({
            name: userID,
            type: 'dir',
            userID: userID,
            path: rootPath,
        })
        fs.mkdir(path.resolve(__dirname, '../..', 'storage', `${userID}`),(err) => {
            console.log(err)
        })
    }

    async createFolder(folderDto: FolderDto, userID){
        const parentFolder = await this.fileModel.findOne({ $or:[ {'_id': folderDto.parentFolderId}, {'name': folderDto.parentFolderId}]})
        const folderPath = path.resolve('storage', `${folderDto.currentFolder}`, `${folderDto.folderName}`)
        const existFolder = fs.existsSync(folderPath)
        
        if(existFolder){
           throw new BadRequestException('such a folder already exist')
        }

        fs.mkdir(folderPath, (err) => {
            console.log(err)
        })

        const folder = await this.fileModel.create({
            name: folderDto.folderName,
            type: 'dir',
            userID: userID,
            path: folderPath,
            shareLink: uuidv4()
        })
    
        parentFolder.childs.push(folder.id)
        await parentFolder.save()

        return folder
    }

    async uploadFiles(files, userID, currentPath, parentFolderID){
        const uploadedFiles = await Promise.all(files.map(async (file) => {
            let originalName = file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')

            const filePath = path.join(__dirname, '../..', 'storage', currentPath, file.originalname)
            
            const fileExist = fs.existsSync(filePath)

            if(fileExist){
                throw new BadRequestException(`some files already exist`);
            }

            const user = await this.userModel.findById(userID)

            if(user.usedSpace + file.size > user.availableSpace){
                throw new BadRequestException('free space is over');
            }

            fs.writeFile(filePath, file.buffer, {encoding: "binary"}, (err) => {
                console.log(err)
            })

            const typeFileArr = originalName.split('.')
            const uploadedFile = await this.fileModel.create({
                name: originalName,
                type: '.' + typeFileArr[typeFileArr.length - 1],
                path: path.join(currentPath, originalName),
                userID: userID,
                size: file.size,
                shareLink: uuidv4()
            })

            const parentFolder = await this.fileModel.findOne({ $or:[ {'_id': parentFolderID}, {'name': parentFolderID}]})
            
            parentFolder.childs.push(uploadedFile.id)
            parentFolder.size = parentFolder.size + uploadedFile.size
            await parentFolder.save()

            user.usedSpace += file.size
            await user.save()

            return uploadedFile
        }))
        const user = await this.userModel.findById(userID)
        const parentFolder = await this.fileModel.findOne({ $or:[ {'_id': parentFolderID}, {'name': parentFolderID}]})
        return {
            uploadedFiles,
            user,
            parentFolder
        }
    }

    async deleteFile(deleteFileDto: {id: string, parentFolderID: string}){
        console.log(deleteFileDto)
        const parentFolder = await this.fileModel.findOne({ $or:[ {'_id': deleteFileDto.parentFolderID}, {'name': deleteFileDto.parentFolderID}]})
        parentFolder.childs = parentFolder.childs.filter(fileID => fileID != deleteFileDto.id)

        const file = await this.fileModel.findByIdAndDelete(deleteFileDto.id)
        file.childs.forEach(async id => {
            await this.fileModel.findByIdAndDelete(id)
        })

        const user = await this.userModel.findById(file.userID)
        if(user.usedSpace - file.size < 0){
            user.usedSpace = 0
        } else {
            user.usedSpace = user.usedSpace - file.size
        }
        user.save()
        parentFolder.size = parentFolder.size - file.size
        parentFolder.save()

        fs.rm(file.path, {recursive: true}, err => {
            console.log(err)
        })

        return user
    }

    async renameFile(renameFileDto: {newName: string, fileID: string}){
        const file =  await this.fileModel.findById(renameFileDto.fileID)
        const newPath = file.path.slice(0, file.path.indexOf(file.name)) + renameFileDto.newName
        fs.rename(file.path, newPath, err => {
            console.log(err)
        })
        file.path = newPath
        file.name = renameFileDto.newName
        await file.save()
    }

    async getCurrentFolder(id: string){
        return await this.fileModel.findOne({ $or:[ {'_id': id}, {'name': id}]}).populate('childs')
    }

    async downloadFile(fileID: string){
        const file = await this.fileModel.findOne({ $or:[ {'_id': fileID}, {'name': fileID}]})
        const filePath = path.resolve(process.cwd(), file.path)

        return filePath
    }
    
    async downloadFolder(folderID: string){
        const file = await this.fileModel.findOne({ $or:[ {'_id': folderID}, {'name': folderID}]})
        const filePath = path.resolve(process.cwd(), file.path)

        const output = fs.createWriteStream(filePath);

        const archive = archiver('zip');

        output.on('close', function () {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
        });
        
        archive.on('error', function(err){
            throw err;
        });
        
        archive.pipe(output);
        
        archive.directory(filePath, false);
        
        archive.finalize();

        return {fileName: file.name, stream: archive}
    }

    async shareFiles(link: string){
        const file = await this.fileModel.findOne({shareLink: link}).populate('childs')
        if(!file){
            throw new BadRequestException('Invalid share link!')
        }
        return {
            currentFolder: file,
            files: file.type === 'dir'? file.childs : [file]
        }
    }

    async moveFile(moveFileDto){
        const movingFile = await this.fileModel.findById(moveFileDto.movingFileId)
        const targetFolder = await this.fileModel.findOne({ $or:[ {'_id': moveFileDto.targetFolderId}, {'name': moveFileDto.targetFolderId}]})
        const parentFolder = await this.fileModel.findOne({ $or:[ {'_id': moveFileDto.parentFolderId}, {'name': moveFileDto.parentFolderId}]})
        if(!targetFolder.childs.includes(movingFile.id)){


            fs.rename(path.join(__dirname, '../..', 'storage', movingFile.path), `${targetFolder.path}/${movingFile.name}`, (err) => {
                console.log(err)
            })

            let correctFolderPath = targetFolder.path.replace(path.join(__dirname, '../..',  'storage'), '')
            
            movingFile.path = `${correctFolderPath}/${movingFile.name}`
            targetFolder.childs.push(movingFile.id)
            targetFolder.size = targetFolder.size + movingFile.size
            parentFolder.size =  parentFolder.size - movingFile.size
            parentFolder.childs = parentFolder.childs.filter(fileID => fileID != movingFile.id)
            await movingFile.save()
            await targetFolder.save()
            await parentFolder.save()
        }
        let currentFolder = await this.getCurrentFolder(parentFolder.id)
        return {
            currentFolder,
            targetFolder
        }
    }
}