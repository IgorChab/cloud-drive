import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {File} from '../../interfaces/user.interface'

type ModalWindowType = 'create' | 'rename'

export interface ModalWindow {
    open: boolean
    type?: ModalWindowType
}

interface InitialState {
    modal: ModalWindow
    dataList: boolean
    currentFile: File
    uploadProgressModal: {
        open: boolean,
        files: any[] | null
    }
}


const eventSlice = createSlice({
    initialState: {
        modal: {
            open: false,
            type: 'create'
        },
        dataList: false,
        currentFile: {},
        uploadProgressModal: {
            open: false,
            files: null
        }
    } as InitialState,
    name: 'event',
    reducers: {
        openModal: (state, {payload: type}: PayloadAction<ModalWindowType>) => {
            state.modal.open = true
            state.modal.type = type
        },
        closeModal: (state) => {
            state.modal.open = false
        },
        switchFileContainer: (state) => {
            state.dataList = !state.dataList
        },
        setCurrentFile: (state, {payload: file}: PayloadAction<File>) => {
            state.currentFile = file
        },
        openUploadProgressModal: (state, {payload: files}: PayloadAction<any[]>) => {
            state.uploadProgressModal.open = true
            state.uploadProgressModal.files = files
        },
        closeUploadProgressModal: state => {
            state.uploadProgressModal.open = false
            state.uploadProgressModal.files = []
        }
    }
})

export default eventSlice.reducer

export const {
    closeModal, 
    openModal, 
    switchFileContainer, 
    setCurrentFile, 
    closeUploadProgressModal, 
    openUploadProgressModal
} = eventSlice.actions