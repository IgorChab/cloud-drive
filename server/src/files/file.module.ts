import {Module} from "@nestjs/common";
import {FileController} from "./file.controller";
import {FileService} from "./file.service";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../models/user.model";
import {File, FileSchema} from "../models/file.model";
import {JwtModule} from "@nestjs/jwt";
import {Token, TokenSchema} from "../models/token.model";
import {MulterModule} from "@nestjs/platform-express";
import { diskStorage } from 'multer'
import * as path from 'path'

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
            {name: File.name, schema: FileSchema},
            {name: Token.name, schema: TokenSchema},
        ]),
        JwtModule.register({}),
        MulterModule.register({
            storage: diskStorage({
                destination: (req, file, cb) => {
                    // @ts-ignore
                    cb(null, path.resolve(__dirname, '../..', 'storage', `${req.userID}`))
                },
                filename: (req, file, cb) => {
                    cb(null, file.originalname)
                }
            })
        })
    ],
    controllers: [FileController],
    providers: [FileService],
})
export class FileModule {}
