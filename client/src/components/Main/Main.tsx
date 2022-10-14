import React from 'react';
import {Button, Grid} from "@material-ui/core";
import {AiOutlinePlus} from "react-icons/ai";
import './Main.css'
import SearchInput from "../SearchInput/SearchInput";
import Modal from '../Modal/Modal'
import { useAppDispatch, useTypedSelector } from '../../hooks/redux';
import { openModal } from '../../features/events/eventSlice';
import MyDropzone from '../Dropzone/MyDropzone';

export interface ModalWindow {
    open: boolean
    type?: 'create' | 'rename'
}

const Main = () => {

    const dispatch = useAppDispatch()

    const modal = useTypedSelector(state => state.event.modal)

    return (
        <>
            {modal.open && <Modal/>}
            <Grid
                container
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                <p className='mainTitle'>My Drive</p>
                <Button 
                    color={"primary"} 
                    variant={"contained"} 
                    style={{backgroundColor: '#1890FF'}} 
                    onClick={() => dispatch(openModal('create'))}
                >
                    <div className="btn">
                        <AiOutlinePlus/>
                        <p>Create folder</p>
                    </div>
                </Button>
            </Grid>
            <SearchInput/>
            <MyDropzone/>
        </>
    );
};

export default Main;