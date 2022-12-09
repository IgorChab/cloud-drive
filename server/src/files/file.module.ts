import {Module} from "@nestjs/common";
import {FileController} from "./file.controller";
import {FileService} from "./file.service";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../models/user.model";
import {File, FileSchema} from "../models/file.model";
import {JwtModule} from "@nestjs/jwt";
import {Token, TokenSchema} from "../models/token.model";
import {MulterModule} from "@nestjs/platform-express";
import { memoryStorage } from 'multer'
import * as path from 'path'

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
            {name: File.name, schema: FileSchema},
            {name: Token.name, schema: TokenSchema}
        ]),
        JwtModule.register({}),
        MulterModule.register({
            storage: memoryStorage()
        })
    ],
    controllers: [FileController],
    providers: [FileService],
})
export class FileModule {}
