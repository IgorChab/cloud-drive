import {Body, Controller, Get, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors} from '@nestjs/common'
import {AuthGuard} from "../auth/auth.guard";
import {FileService} from "./file.service";
import {FileCreationDto} from "../dto/file.dto";
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";

@Controller('files')
@UseGuards(AuthGuard)
export class FileController {
    constructor(private fileService: FileService) {}

    @Post('create')
    @UseInterceptors(FileInterceptor('file'))
    async createFolder(@UploadedFile() file: Express.Multer.File, @Req() req){
        return await this.fileService.addFile(file, req.userID)
    }
}