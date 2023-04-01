import $axios from "../http";
import {addFile, setFiles, deleteFile, renameFile, setUser, updatePinndedFolder} from '../../features/user/userSlice'
import { openUploadProgressModal, updateStatusProgressModal} from '../../features/events/eventSlice'
import { store } from "../store";
import {File, User} from '../../interfaces/user.interface'

interface folderCreationDto {
    currentFolder: string | null
    folderName: string
    parentFolderId: string
}

interface renameFileDto {
    newName: string
    fileID: string
}

interface deleteFileDto {
    id: string 
    parentFolderID: string
}

interface UploadResponse {
    user: User, 
    uploadedFiles: File[], 
    parentFolder: File
}

export const controller = new AbortController()

class FileService {
    static async uploadFiles(files: any, fd: FormData): Promise<UploadResponse>{
        controller.signal.addEventListener('abort', () => alert('File upload canceled!'))
        files.forEach((file: any) => {
            fd.append('files', file)
        });
        const response = await $axios.post<UploadResponse>('files/uploadFiles', fd, {signal: controller.signal})
        return response.data
    }

    static async deleteFile(deleteFileDto: deleteFileDto){
        const response = await $axios.post<User>(`files/deleteFile`, deleteFileDto)
        store.dispatch(deleteFile(deleteFileDto.id))
        store.dispatch(setUser(response.data))
    }

    static async createFolder(folderDto: folderCreationDto): Promise<File>{
        const response = await $axios.post<File>('files/createFolder', folderDto)
        console.log(response.data)
        store.dispatch(addFile(response.data))
        return response.data
    }

    static async renameFile(renameFileDto: renameFileDto){
        const response = await $axios.post('files/renameFile', renameFileDto)
        store.dispatch(renameFile(renameFileDto))
    }

    static async getCurrentFolder(id: string){
        const response = await $axios.get<File>(`files/getCurrentFolder/${id}`)
        store.dispatch(setFiles(response.data.childs))
    }

    static async moveFile(moveFileDto: {parentFolderId: string, movingFileId: string, targetFolderId: string}){
        const response = await $axios.post('files/moveFile', moveFileDto)
        store.dispatch(setFiles(response.data.currentFolder.childs))
        if(response.data.targetFolder.name === store.getState().appInfo.user?._id){
            store.dispatch(updatePinndedFolder(response.data.currentFolder))
        } else {
            store.dispatch(updatePinndedFolder(response.data.targetFolder))
        }
    }
}

export default FileService