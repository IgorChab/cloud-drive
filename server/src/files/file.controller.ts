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
export class FileController {
    constructor(private fileService: FileService) {}

    @Post('uploadFiles')
    @UseGuards(AuthGuard)
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Req() req){
        const uploaded = await this.fileService.uploadFiles(files, req.userID, req.body.currentPath, req.body.currentFolderID)
        return uploaded
    }

    @Post('createFolder')
    @UseGuards(AuthGuard)
    async createFolder(@Body() folderDto: FolderDto, @Req() req){
        return await this.fileService.createFolder(folderDto, req.userID)
    }

    @Post('deleteFile')
    @UseGuards(AuthGuard)
    async deleteFile(@Body() deleteFileDto: {id: string, parentFolderID: string}) {
        return await this.fileService.deleteFile(deleteFileDto) 
    }

    @Post('renameFile')
    @UseGuards(AuthGuard)
    async renameFile(@Body() renameFileDto: {newName: string, fileID: string}) {
        console.log(renameFileDto)
        this.fileService.renameFile(renameFileDto)
    }

    @Get('getCurrentFolder/:id')
    async getCurrentFolder(@Param('id') fileID: string,){
        return await this.fileService.getCurrentFolder(fileID)
    }

    @Get('downloadFile/:id')
    async downloadFile(@Param('id') fileID: string, @Res() res){
        const filePath = await this.fileService.downloadFile(fileID)
        return res.download(filePath)
    }

    @Get('downloadFolder/:id')
    async downloadFolder(@Param('id') folderID: string, @Res() res){
        const file = await this.fileService.downloadFolder(folderID)
        res.attachment(file.fileName + '.zip')
        return file.stream.pipe(res)
    }

    @Get('shareFiles/:link')
    async shareFiles(@Param('link') link: string){
        return await this.fileService.shareFiles(link)
    }

    @Post('moveFile')
    async moveFile(@Body() moveFileDto: {parentFolderId: string, movingFileId: string, targetFolderId: string}){
        return await this.fileService.moveFile(moveFileDto)
    }
}