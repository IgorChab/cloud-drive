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
        return uploaded[0]
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
    async deleteFolder(@Body() renameFileDto: {newName: string, fileID: string}) {
        console.log(renameFileDto)
        this.fileService.renameFile(renameFileDto)
    }

    @Get('getCurrentFolder/:id')
    @UseGuards(AuthGuard)
    async getCurrentFolder(@Param('id') fileID: string,){
        return await this.fileService.getCurrentFolder(fileID)
    }

    @Get('downloadFile/:id')
    async downloadFile(@Param('id') fileID: string, @Req() req, @Res() res){
        const file = await this.fileService.downloadFile(fileID, req.userID)
        res.download(file.path, file.name)
    }

    @Get('shareFiles/:link')
    async shareFiles(@Param('link') link: string){
        return await this.fileService.shareFiles(link)
    }
}