import {Injectable, BadRequestException, UnauthorizedException} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'
import {User, UserDocument} from "../models/user.model";
import {IUser, UserCreationAttr, UserData} from "../interfaces/user.interface";

import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import {TokenPayload, Tokens} from "../interfaces/token.interface";
import {Token, TokenDocument} from '../models/token.model';
import {JwtService} from "@nestjs/jwt";
import {LoginUserDto} from "../dto/user.dto";
import {FileService} from "../files/file.service";

@Injectable()
export class AuthService{
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
        private fileService: FileService,
        @InjectModel(Token.name) private tokenModel: Model<TokenDocument>
    ) {}

    async register(props: UserCreationAttr): Promise<IUser>{
        const candidate = await this.userModel.findOne({email: props.email})
        if(candidate){
            throw new BadRequestException('Пользователь с таким email уже существует!');
        }
        const hashPassword = await bcrypt.hash(props.password, 5)
        const user: IUser =  await this.userModel.create({...props, password: hashPassword})
        this.fileService.createDrive(user._id)
        return user
    }

    async getAllUsers(): Promise<IUser[]> {
        return this.userModel.find()
    }

    async login(props: LoginUserDto): Promise<UserData> {
        const user: IUser = await this.userModel.findOne({email: props.email})
        if(!user){
            throw new BadRequestException("Пользователь с таким email не найден")
        }
        const validPassword = await bcrypt.compare(props.password, user.password)
        if(!validPassword){
            throw new BadRequestException("Неверный пароль")
        }
        const tokenHash = uuidv4();
        const tokens = await this.generateTokens({
            userID: user._id,
            tokenHash
        })
        return {
            ...tokens,
            user
        }
    }

    async refresh(refreshToken: string){
        return await this.validateRefrashToken(refreshToken)
    }

    private async generateTokens(payload: TokenPayload): Promise<Tokens>{
        const token = await this.tokenModel.findOne({userID: payload.userID})
        if(!token){
            await this.tokenModel.create(payload)
        } else {
            await this.tokenModel.updateOne({userID: payload.userID}, {tokenHash: payload.tokenHash})
        }
        const accessToken = this.jwtService.sign(payload, {secret: process.env.ACCESS_SECRET, expiresIn: '1m'})
        const refreshToken = this.jwtService.sign(payload, {secret: process.env.REFRESH_SECRET, expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    private async validateRefrashToken(refreshToken: string): Promise<IUser & Tokens>{
        try {
            const tokenPayload: TokenPayload = this.jwtService.verify(refreshToken, {secret: process.env.REFRESH_SECRET})
            const existHash = await this.tokenModel.findOne({tokenHash: tokenPayload.tokenHash})
            if (!existHash){
                throw new UnauthorizedException('Пользователь не авторизован')
            }
            const tokenHash = uuidv4()
            const tokens = await this.generateTokens({
                tokenHash: tokenHash,
                userID: tokenPayload.userID
            })
            const user: IUser = await this.userModel.findById(tokenPayload.userID)
            return {
                ...user,
                ...tokens
            }
        } catch (e) {
            throw new UnauthorizedException('Пользователь не авторизован')
        }
    }


}