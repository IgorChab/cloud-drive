import {Body, Controller, Get, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors} from '@nestjs/common'
import {AuthGuard} from "../auth/auth.guard";
import {FileService} from "./file.service";
import {FileCreationDto} from "../dto/file.dto";
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import {FolderDto} from "../dto/folder.dto";

@Controller('files')
@UseGuards(AuthGuard)
export class FileController {
    constructor(private fileService: FileService) {}

    @Post('create')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFiles(@UploadedFiles() file: Express.Multer.File, @Req() req){
        console.log(file)
        return await this.fileService.addFile(file, req.userID)
    }

    @Post('addDir')
    async createDir(@Body() folderDto: FolderDto){
        await this.fileService.addFolder(folderDto)
        return "created dir"
    }
}