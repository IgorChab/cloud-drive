import {createSlice, PayloadAction} from '@reduxjs/toolkit'
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
    dataGrid: boolean
    contextMenu: Coords
}


const eventSlice = createSlice({
    initialState: {
        modal: {
            open: false,
            type: 'create'
        },
        dataGrid: false,
        contextMenu: {
            mouseX: null,
            mouseY: null,
        }
    } as InitialState,
    name: 'event',
    reducers: {
        openModal: (state, {payload: type}:PayloadAction<ModalWindowType>) => {
            state.modal.open = true
            state.modal.type = type
        },
        closeModal: (state) => {
            state.modal.open = false
        },
        switchFileContainer: (state) => {
            state.dataGrid = !state.dataGrid
        },
        // openContextMenu: (state, {payload: event}:PayloadAction<React.MouseEvent<HTMLDivElement>>) => {
        //     event.preventDefault();
        //     state.contextMenu.mouseX = event.clientX - 2 
        //     state.contextMenu.mouseY = event.clientY - 4
        // },
        // closeContextMenu: (state) => {
        //     state.contextMenu.mouseX = null
        //     state.contextMenu.mouseY = null
        // }
    }
})

export default eventSlice.reducer

export const {closeModal, openModal, switchFileContainer,
    //  closeContextMenu, openContextMenu
    } = eventSlice.actions