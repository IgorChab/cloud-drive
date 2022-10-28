import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {User, File} from '../../interfaces/user.interface'
import {RootState} from "../../app/store";

interface UserState {
    user: User | null
    accessToken: string | null
    currentPath: string
    folderStack: File[]
    currentFolder: File | null
}

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        accessToken: null,
        currentPath: '',
        folderStack: [],
        currentFolder: null
    } as UserState,
    reducers: {
        setCredentials: (state, {payload: {user, accessToken}}:PayloadAction<{user: User, accessToken: string}>) => {
            state.user = user
            state.accessToken = accessToken
            state.currentPath = user._id
        },
        // setFiles: (state, {payload: files}: PayloadAction<File[] | File>) => {
        //     state.user!.files.concat(files)
        // },
        // deleteFile: (state, {payload: id}: PayloadAction<string>) => {
        //     state.user!.files.filter(file => file._id !== id)
        // },
        logout: (state) => {
            state.user = null
            state.accessToken = null
        },
        openFolder: (state, {payload: folder}: PayloadAction<File>) => {
            if(!state.folderStack.includes(folder)) {
                state.folderStack.push(folder)
                state.currentPath += `/${folder.name}`
                state.currentFolder = state.folderStack[state.folderStack.length - 1]
            }
        },
        closeFolder: (state, {payload: folder}: PayloadAction<File>) => {
            state.folderStack = state.folderStack.slice(0, state.folderStack.findIndex(file => file._id === folder._id) + 1)
            state.currentPath = state.currentPath.split('/').slice(0, state.currentPath.split('/').indexOf(folder.name) + 1).join('/')
            state.currentFolder = state.folderStack[state.folderStack.length - 1]
        },
        closeAllFolders: state => {
            state.folderStack = []
            state.currentFolder = null
            state.currentPath = state.user!._id
        }
    }
})

export const { 
    setCredentials, 
    logout, 
    // setFiles, 
    // deleteFile, 
    closeFolder, 
    openFolder, 
    closeAllFolders 
} = userSlice.actions
export default userSlice.reducer