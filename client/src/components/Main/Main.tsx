import React from 'react';
import {Button, Grid, Breadcrumbs} from "@material-ui/core";
import {AiOutlinePlus} from "react-icons/ai";
import SearchInput from "../SearchInput/SearchInput";
import Modal from '../Modal/Modal'
import { useAppDispatch, useTypedSelector } from '../../hooks/redux';
import { openModal } from '../../features/events/eventSlice';
import MyDropzone from '../Dropzone/MyDropzone';

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
                <p className='font-medium text-[38px]'>My Drive</p>
                <Button 
                    color={"primary"} 
                    variant={"contained"} 
                    className='!bg-[#1890FF]'
                    onClick={() => dispatch(openModal('create'))}
                >
                    <div className="flex gap-[10px] items-center">
                        <AiOutlinePlus/>
                        <p>Create folder</p>
                    </div>
                </Button>
            </Grid>
            <Breadcrumbs>
                <div className='cursor-pointer hover:underline'>
                    Material-UI
                </div>
                <div>
                    Core
                </div>
                <div className='text-black'>Breadcrumb</div>
            </Breadcrumbs>
            <SearchInput/>
            <MyDropzone/>
        </>
    );
};

export default Main;