import {Injectable} from "@nestjs/common";
import * as fs from 'fs'
import * as path from 'path'
import {Model} from "mongoose";
// import {User, UserDocument} from "../models/user.model";
import {File, FileDocument} from "../models/file.model";
import {FileCreationDto} from "../dto/file.dto";
import {InjectModel} from "@nestjs/mongoose";
import {FolderDto} from "../dto/folder.dto";

@Injectable()
export class FileService {
    constructor(
        // @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(File.name) private fileModel: Model<FileDocument, FileCreationDto>
    ) {}
    createDrive(userID: string){
        fs.mkdir(path.resolve(__dirname, '../..', 'storage', `${userID}`),(err) => {
            console.log(err)
        })
    }

    async addFolder(folderDto: FolderDto){
        fs.mkdir(path.resolve(__dirname, '../..', 'storage',`${folderDto.currentDir}`,`${folderDto.folderName}`),(err) => {
            console.log(err)
        })
        // return await this.fileModel.create(folderDto)
    }

    async addFile(file, userID){
        const index = file.path.indexOf("\storage");
        const path = file.path.slice(index)
        return await this.fileModel.create({
            name: file.originalname,
            type: file.mimetype,
            path,
            userID: userID,
            size: file.size
        })
    }
}