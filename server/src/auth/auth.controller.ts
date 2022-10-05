import {Controller, Post, Body, Res, Get, UseGuards, Req, UnauthorizedException} from '@nestjs/common'
import { AuthService } from './auth.service'
import {CreateUserDto, LoginUserDto} from "../dto/user.dto";
import {AuthGuard} from "./auth.guard";


@Controller()
export class AuthController{
    constructor(private authService: AuthService) {}
    @Post()
    async registration(
        @Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) response){
        return await this.authService.register(createUserDto)
    }

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) response){
        const userData = await this.authService.login(loginUserDto)
        response.cookie('refreshToken', userData.refreshToken, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
        delete userData.refreshToken
        return userData
    }

    @Get('refresh')
    async refresh(@Req() req, @Res({ passthrough: true }) res){
        if (!req.cookies.refreshToken){
            throw new UnauthorizedException('Пользователь не авторизован!')
        }
        const userData = await this.authService.refresh(req.cookies.refreshToken)
        res.cookie('refreshToken', userData.refreshToken, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
        delete userData.refreshToken
        return userData
    }

    @Get('users')
    @UseGuards(AuthGuard)
    getAllUsers(){
        return this.authService.getAllUsers()
    }
}