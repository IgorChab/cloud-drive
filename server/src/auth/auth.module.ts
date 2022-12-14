import { Module } from '@nestjs/common'
import {User, UserSchema} from "../models/user.model";
import {AuthService} from "./auth.service";
import {AuthController} from "./auth.controller";
import {JwtModule} from "@nestjs/jwt";
import {Token, TokenSchema} from "../models/token.model";
import { MongooseModule } from '@nestjs/mongoose';
import {FileService} from "../files/file.service";
import {File, FileSchema} from "../models/file.model";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
            {name: Token.name, schema: TokenSchema},
            {name: File.name, schema: FileSchema}
        ]),
        JwtModule.register({}),
    ],
    controllers: [AuthController],
    providers: [AuthService, FileService],
})
export class AuthModule {}