import {
    Body, 
    Controller, 
    Get, Post, Delete,
    Req, Param,
    UploadedFiles, 
    UseGuards, 
    UseInterceptors} from '@nestjs/common'
import {AuthGuard} from "../auth/auth.guard";
import {FileService} from "./file.service";
import {FilesInterceptor} from "@nestjs/platform-express";
import {FolderDto} from "../dto/folder.dto";

@Controller('files')
@UseGuards(AuthGuard)
export class FileController {
    constructor(private fileService: FileService) {}

    @Post('uploadFiles')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Req() req){
        console.log('body',req.body)
        return await this.fileService.uploadFiles(files, req.userID, req.body.currentFolder)
    }

    @Post('createFolder')
    async createFolder(@Body() folderDto: FolderDto, @Req() req){
        return await this.fileService.createFolder(folderDto, req.userID)
    }

    @Delete('deleteFile/:id')
    async deleteFile(@Param('id') fileID: string) {
        this.fileService.deleteFile(fileID) 
    }

    // @Delete('deleteFolder/:id')
    // async deleteFolder(@Param('id') folderID: string) {
    //     this.fileService.deleteFolder(folderID)
    // }
}