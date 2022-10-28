import {
    Body, 
    Controller, 
    Get, Post, Delete,
    Req, Param, Res,
    UploadedFiles, 
    UseGuards, 
    StreamableFile,
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
        return await this.fileService.uploadFiles(files, req.userID, req.body.currentPath, req.body.currentFolderID)
    }

    @Post('createFolder')
    async createFolder(@Body() folderDto: FolderDto, @Req() req){
        return await this.fileService.createFolder(folderDto, req.userID)
    }

    @Delete('deleteFile/:id')
    async deleteFile(@Param('id') fileID: string) {
        this.fileService.deleteFile(fileID) 
    }

    @Post('renameFile')
    async deleteFolder(@Body() renameFileDto: {newName: string, fileID: string}) {
        this.fileService.renameFile(renameFileDto)
    }

    @Post('getCurrentFolder')
    async getCurrentFolder(@Body() dto: {fileID: string}){
        return this.fileService.getCurrentFolder(dto.fileID)
    }

    @Get('downloadFile/:id')
    async downloadFile(@Param('id') fileID: string, @Req() req, @Res() res){
        const file = await this.fileService.downloadFile(fileID, req.userID)
        res.download(file.path, file.name)
    }
}