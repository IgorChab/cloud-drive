import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {File} from '../../interfaces/user.interface'

interface InitialState {
    currentFolder: string | null
    files: File[]
}

const fileSlice = createSlice({
    name: 'storage',
    initialState: {
        currentFolder: null,
        files: [],
    } as InitialState,
    reducers: {
        setStorageInfo: (state, {payload: {currentFolder, files}}: PayloadAction<InitialState>) => {
            state.currentFolder = currentFolder
            state.files = files
        },
        setFiles: (state, {payload: files}: PayloadAction<File[]>) => {
            state.files = files
        },
    }
})

export default fileSlice.reducer

export const {setStorageInfo, setFiles} = fileSlice.actions