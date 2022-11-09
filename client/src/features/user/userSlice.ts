import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {User, File} from '../../interfaces/user.interface'

interface UserState {
    user: User | null
    accessToken: string | null
    currentPath: string
    folderStack: File[]
    currentFolder: File | null
    files: File[]
    isAuth: boolean
    isLoading: boolean
    pinnedFolders: File[]
}

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        accessToken: null,
        currentPath: '',
        folderStack: [],
        currentFolder: null,
        files: [],
        isAuth: false,
        isLoading: false,
        pinnedFolders: []
    } as UserState,
    reducers: {
        setLoading: (state, {payload: bool}: PayloadAction<boolean>) => {
            state.isLoading = bool
        },
        setCredentials: (state, {payload: {user, accessToken}}: PayloadAction<{user: User, accessToken: string}>) => {
            state.user = user
            state.accessToken = accessToken
            state.currentPath = user._id
            state.isAuth = true
        },
        setUser: (state, {payload: user}: PayloadAction<User>) => {
            state.user = user
        },
        setFiles: (state, {payload: files}: PayloadAction<File[]>) => {
            state.files = files
        },
        addFile: (state, {payload: file}: PayloadAction<File[] | File>) => {
            state.files = state.files.concat(file)
        },
        renameFile: (state, {payload: renameDto}: PayloadAction<{newName: string, fileID: string}>) => {
            state.files.forEach(file => {
                if(file._id == renameDto.fileID){
                    file.name = renameDto.newName
                }
            })
        },
        deleteFile: (state, {payload: id}: PayloadAction<string>) => {
            state.files = state.files.filter(file => file._id !== id)
            state.pinnedFolders = state.pinnedFolders.filter(file => file._id !== id)
        },
        logout: (state) => {
            state.user = null
            state.accessToken = null
            state.isAuth = false
            state.pinnedFolders = []
            state.currentPath = ''
            localStorage.removeItem('token')
        },
        openFolder: (state, {payload: folder}: PayloadAction<File>) => {
            if(!state.folderStack.includes(folder)) {
                state.folderStack.push(folder)
                state.currentPath += `/${folder.name}`
                state.currentFolder = state.folderStack[state.folderStack.length - 1]
            }
        },
        openPinnedFolder: (state, {payload: folder}: PayloadAction<File>) => {
            // state.folderStack = folder.path.split('\\').slice(state.currentPath)
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
        },
        addPinnedFolder: (state, {payload: folder}: PayloadAction<File>) => {
            state.pinnedFolders.push(folder)
        }
    }
})

export const { 
    setCredentials,
    setUser,
    logout, 
    setFiles, 
    setLoading,
    renameFile,
    addFile,
    deleteFile, 
    closeFolder, 
    openFolder, 
    closeAllFolders,
    addPinnedFolder,
} = userSlice.actions
export default userSlice.reducer