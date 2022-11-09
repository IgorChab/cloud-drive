import $axios from "../http";
import {addFile, setFiles, deleteFile, renameFile, setUser} from '../../features/user/userSlice'
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

export const controller = new AbortController()

class FileService {
    static async uploadFiles(files: any, fd: FormData): Promise<void>{
        controller.signal.addEventListener('abort', () => alert('File upload canceled!'))
        files.forEach((file: any) => {
            fd.append('files', file)
        });
        store.dispatch(openUploadProgressModal(files))
        try{
            const response = await $axios.post<{user: User, uploadedFile: File[]}>('files/uploadFiles', fd, {signal: controller.signal})
            console.log(response)
            store.dispatch(addFile(response.data.uploadedFile))
            store.dispatch(setUser(response.data.user))
            store.dispatch(updateStatusProgressModal('success'))
        } catch(e) {
            console.log(e)
            store.dispatch(updateStatusProgressModal('error'))
        }
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
}

export default FileService