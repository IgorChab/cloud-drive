import React from 'react';
import {Button, Grid, Breadcrumbs, makeStyles} from "@material-ui/core";
import {AiOutlinePlus} from "react-icons/ai";
import SearchInput from "../SearchInput/SearchInput";
import Modal from '../Modal/Modal'
import { useAppDispatch, useTypedSelector } from '../../hooks/redux';
import { openModal } from '../../features/events/eventSlice';
import MyDropzone from '../Dropzone/MyDropzone';
import { closeFolder, closeAllFolders} from '../../features/user/userSlice';

const Main = () => {

    const dispatch = useAppDispatch()

    const modal = useTypedSelector(state => state.event.modal)

    const folderStack = useTypedSelector(state => state.appInfo.folderStack)

    const useStyles = makeStyles({
        ol: {
            display: 'flex',
            alignItems: 'baseline'
        }
    })

    const classes = useStyles()

    return (
        <>
            {modal.open && <Modal/>}
            <Grid
                container
                justifyContent={"space-between"}
                alignItems={"center"}
            >
                <Breadcrumbs maxItems={4} itemsBeforeCollapse={2} itemsAfterCollapse={2} classes={{ol: classes.ol}}>
                    <p 
                        className={`font-medium text-[34px] ${folderStack.length == 0? 'text-black' : 'cursor-pointer'}`}
                        onClick={() => dispatch(closeAllFolders())}
                    >
                        My Drive
                    </p>
                    {folderStack.map((folder, i) => (
                        <div 
                            className={`${i == folderStack.length - 1? 'text-black' : 'cursor-pointer hover:underline'}`}
                            onClick={() => dispatch(closeFolder(folder))}
                            key={folder._id}
                        >
                            {folder.name}
                        </div>
                    ))}
                </Breadcrumbs>
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
            <SearchInput/>
            <MyDropzone/>
        </>
    );
};

export default Main;