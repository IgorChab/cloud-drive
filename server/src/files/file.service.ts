import {Injectable, BadRequestException, ForbiddenException} from "@nestjs/common";
import * as fs from 'fs'
import * as path from 'path'
import {Model} from "mongoose";
import {File, FileDocument} from "../models/file.model";
import {User, UserDocument} from "../models/user.model";
import {FileCreationDto} from "../dto/file.dto";
import {InjectModel} from "@nestjs/mongoose";
import {FolderDto} from "../dto/folder.dto";

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
        const folderPath = path.resolve(__dirname, '../..', 'storage',`${folderDto.currentFolder}`,`${folderDto.folderName}`)
        const existFolder = fs.existsSync(folderPath)
        
        if(existFolder){
           throw new BadRequestException('such a folder already exist')
        }

        fs.mkdir(folderPath, (err) => {
            console.log(err)
        })

        // const user = await this.userModel.findById(userID)

        const folder = await this.fileModel.create({
            name: folderDto.folderName,
            type: 'dir',
            userID: userID,
            path: folderPath,
        })
        
        console.log(parentFolder)
        // if(parentFolder){
            parentFolder.childs.push(folder.id)
            await parentFolder.save()
        // } else {
        //     user.files.push(folder.id)
        //     await user.save()
        // }
        return folder
    }

    async uploadFiles(files, userID, currentPath, parentFolderID){
        return Promise.allSettled(files.map(async (file) => {
            const filePath = path.join(__dirname, '../..', 'storage', currentPath, file.originalname)

            const fileExist = fs.existsSync(filePath)

            if(fileExist){
                throw new BadRequestException(`${file.originalname} already exist`);
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
            })

            const parentFolder = await this.fileModel.findOne({ $or:[ {'_id': parentFolderID}, {'name': parentFolderID}]})

            // if(parentFolder){
                parentFolder.childs.push(uploadedFile.id)
                parentFolder.size += uploadedFile.size
                await parentFolder.save()
            // } else {
                user.usedSpace += file.size
                await user.save()
            // }

            return uploadedFile
        }))
    }

    async deleteFile(fileID){
        const file = await this.fileModel.findByIdAndDelete(fileID)
        file.childs.forEach(async id => {
            await this.fileModel.findByIdAndDelete(id)
        })
        fs.rm(file.path, {recursive: true}, err => {
            console.log(err)
        })
        return file
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

    async getCurrentFolder(id){
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
}