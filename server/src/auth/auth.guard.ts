import {Injectable, CanActivate, ExecutionContext, UnauthorizedException} from '@nestjs/common'
import { Observable } from 'rxjs'
import {JwtService} from "@nestjs/jwt";
import { Token, TokenDocument } from '../models/token.model'
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {TokenPayload} from "../interfaces/token.interface";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @InjectModel(Token.name) private tokenModel: Model<TokenDocument>
    ) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const validateRequest = async (): Promise<boolean> => {
            try{
                const authHeader = request.headers.authorization;
                const tokenType = authHeader.split(' ')[0]
                const token = authHeader.split(' ')[1]
                if(tokenType !== 'Bearer' || !token){
                    throw new UnauthorizedException('Пользователь не авторизован')
                }
                const tokenPayload: TokenPayload = this.jwtService.verify(token, {secret: process.env.ACCESS_SECRET})
                const tokenHash = await this.tokenModel.findOne({tokenHash: tokenPayload.tokenHash})
                if(!tokenHash){
                    throw new UnauthorizedException('Пользователь не авторизован')
                }
                request.userID = tokenHash.userID
                return true
            } catch (e) {
                throw new UnauthorizedException('Пользователь не авторизован')
            }
        }
        return validateRequest();
    }
}
