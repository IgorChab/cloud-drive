import {Injectable} from "@nestjs/common";
import * as fs from 'fs'
import * as path from 'path'
import {Model} from "mongoose";
// import {User, UserDocument} from "../models/user.model";
import {File, FileDocument} from "../models/file.model";
import {FileCreationDto} from "../dto/file.dto";
import {InjectModel} from "@nestjs/mongoose";

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

    async addFolder(props){
        fs.mkdir(path.resolve(__dirname, `${props.name}`),(err) => {
            console.log(err)
        })
        return await this.fileModel.create(props)
    }

    async addFile(file, userID){
        return await this.fileModel.create({
            name: file.originalname,
            type: file.mimetype,
            path: file.path,
            userID: userID,
            size: file.size
        })
    }
}