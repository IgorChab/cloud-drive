import {Injectable, BadRequestException, ForbiddenException} from "@nestjs/common";
import * as fs from 'fs'
import * as path from 'path'
import {Model} from "mongoose";
import {File, FileDocument} from "../models/file.model";
import {User, UserDocument} from "../models/user.model";
import {FileCreationDto} from "../dto/file.dto";
import {InjectModel} from "@nestjs/mongoose";
import {FolderDto} from "../dto/folder.dto";
import {v4 as uuidv4 } from 'uuid'
import { IUser } from "src/interfaces/user.interface";
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
        console.log(folderDto)
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
        return Promise.all(files.map(async (file) => {
            console.log(file.originalname)
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

            const typeFileArr = file.originalname.split('.')
            const uploadedFile = await this.fileModel.create({
                name: file.originalname,
                type: '.' + typeFileArr[typeFileArr.length - 1],
                path: path.join('storage', currentPath, file.originalname),
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

            return {user, uploadedFile}
        }))
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
        user.usedSpace = user.usedSpace - file.size
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

    async downloadFile(fileID, userID){
        const file = await this.fileModel.findOne({ $and:[ {'_id': fileID}, {'userID': userID}]})
        console.log(file)
        if(!file){
            throw new ForbiddenException('The requested file was not found or does not belong to you')
        }
        return file
    }

    async shareFiles(link: string){
        const file = await this.fileModel.findOne({shareLink: link}).populate('childs')
        return {
            fileName: file.name,
            files: file.type === 'dir'? file.childs : file
        }
    }
}