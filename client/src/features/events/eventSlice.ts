import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {File} from '../../interfaces/user.interface'

import React from 'react';

type ModalWindowType = 'create' | 'rename'

export interface ModalWindow {
    open: boolean
    type?: ModalWindowType
}

interface Coords {
    mouseX: null | number;
    mouseY: null | number;
}

interface InitialState {
    modal: ModalWindow
    dataList: boolean
    contextMenu: Coords
    currentFile: File
}


const eventSlice = createSlice({
    initialState: {
        modal: {
            open: false,
            type: 'create'
        },
        dataList: false,
        contextMenu: {
            mouseX: null,
            mouseY: null,
        },
        currentFile: {}
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
        }
    }
})

export default eventSlice.reducer

export const {closeModal, openModal, switchFileContainer, setCurrentFile} = eventSlice.actions