import {Injectable, BadRequestException} from "@nestjs/common";
import * as fs from 'fs'
import * as path from 'path'
import {Model} from "mongoose";
import {Folder, FolderDocument} from "../models/folder.model";
import {File, FileDocument} from "../models/file.model";
import {User, UserDocument} from "../models/user.model";
import {FileCreationDto} from "../dto/file.dto";
import {InjectModel} from "@nestjs/mongoose";
import {FolderDto} from "../dto/folder.dto";

@Injectable()
export class FileService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        // @InjectModel(Folder.name) private folderModel: Model<FolderDocument, FolderDto>,
        @InjectModel(File.name) private fileModel: Model<FileDocument, FileCreationDto>
    ) {}

    createDrive(userID: string){
        fs.mkdir(path.resolve(__dirname, '../..', 'storage', `${userID}`),(err) => {
            console.log(err)
        })
    }

    async createFolder(folderDto: FolderDto, userID){
        const folderPath = path.resolve(__dirname, '../..', 'storage',`${folderDto.currentFolder}`,`${folderDto.folderName}`)

        const existFolder = fs.existsSync(folderPath)
        
        if(existFolder){
           throw new BadRequestException('such a folder already exist')
        }

        fs.mkdir(folderPath, (err) => {
            console.log(err)
        })


        const user = await this.userModel.findById(userID)

        const folder = await this.fileModel.create({
            name: folderDto.folderName,
            type: 'dir',
            userID: userID,
            path: folderPath,
        })

        user.files.push(folder.id)
        await user.save()
        return folder
    }

    async uploadFiles(files, userID, currentFolder){
        return Promise.allSettled(files.map(async file => {

            const filePath = path.join(__dirname, '../..', 'storage', currentFolder, file.originalname)

            const fileExist = fs.existsSync(filePath)

            if(fileExist){
                // return `${file.originalname} already exist`
                throw new Error(`${file.originalname} already exist`);
                
            }

            const user = await this.userModel.findById(userID)

            if(user.usedSpace + file.size > user.availableSpace){
                // return 'free space is over'
                throw new Error('free space is over')
            }

            fs.writeFile(filePath, file.buffer, {encoding: "binary"}, (err) => {
                console.log(err)
            })

            const uploadedFile = await this.fileModel.create({
                name: file.originalname,
                type: file.mimetype,
                path: filePath,
                userID: userID,
                size: file.size,
            })

            user.usedSpace += file.size
            user.files.push(uploadedFile.id)
            await user.save()

            return uploadedFile
        })).catch(e => {
            return e
        })
    }

    async deleteFile(fileID){
        const file =  await this.fileModel.findByIdAndRemove(fileID)
        console.log(file)
        fs.rm(file.path, err => {
            console.log(err)
        })
    }

    // async deleteFolder(folderID){
    //     const folder =  await this.fileModel.findByIdAndRemove(folderID)
    //     console.log(folder)
    //     fs.rm(folder.path, {recursive: true}, err => {
    //         console.log(err)
    //     })
    // }
}