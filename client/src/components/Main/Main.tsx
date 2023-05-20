import React, { useState } from 'react';

import { Button, Grid, Breadcrumbs, makeStyles, Menu, MenuItem } from "@material-ui/core";

import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineCloudUpload, AiOutlineFolderAdd } from "react-icons/ai";

import SearchInput from "../SearchInput/SearchInput";
import Modal from '../Modal/Modal'
import MyDropzone from '../Dropzone/MyDropzone';
import { BreadcrumbsItem } from '../BreadcrumbsItem/BreadcrumbsItem';

import { useAppDispatch, useTypedSelector } from '../../hooks/redux';
import { useDropzone } from 'react-dropzone'
import { useDrop } from 'react-dnd'

import { openModal, updateStatusProgressModal } from '../../features/events/eventSlice';
import { closeFolder, closeAllFolders, addFile, setUser, updatePinndedFolder} from '../../features/user/userSlice';
import { openUploadProgressModal, openDialog } from '../../features/events/eventSlice'

import FileService from '../../app/services/fileService';

import { File } from '../../interfaces/user.interface';


const Main = () => {

    const dispatch = useAppDispatch()

    const modal = useTypedSelector(state => state.event.modal)
    const currentFolder = useTypedSelector(state => state.appInfo.currentFolder)
    const currentPath = useTypedSelector(state => state.appInfo.currentPath)
    const folderStack = useTypedSelector(state => state.appInfo.folderStack)
    const userId = useTypedSelector(state => state.appInfo.user!._id)

    const useStyles = makeStyles({
        ol: {
            display: 'flex',
            alignItems: 'baseline'
        },
    })

    const classes = useStyles()

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleUpload = async (acceptedFiles: any) => {
        dispatch(openUploadProgressModal(acceptedFiles))
        const formData = new FormData()
        formData.append('currentPath', currentPath)
        formData.append('currentFolderID', currentFolder?._id == null ? currentPath : currentFolder?._id)
        try {
            const data = await FileService.uploadFiles(acceptedFiles, formData)
            dispatch(addFile(data.uploadedFiles))
            dispatch(setUser(data.user))
            dispatch(updatePinndedFolder(data.parentFolder))
            dispatch(updateStatusProgressModal({status: 'success', error: ''}))
        } catch (e: any) {
            dispatch(updateStatusProgressModal({status: 'error', error: e?.response?.data?.message}))
        }
    }

    const handleMenuClick = () => {
        handleClose();
        dispatch(openModal('create'))
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleUpload, noClick: true, noKeyboard: true })

    const [{ isOver }, drop] = useDrop({
        accept: 'file',
        drop: (movingFile: File) => {
            FileService.moveFile({
                movingFileId: movingFile._id,
                targetFolderId: userId,
                parentFolderId: currentFolder?._id || currentPath
            })
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        })
    })

    const close = () => {
        if(currentFolder && folderStack.length !== 1){
            dispatch(closeFolder(folderStack[folderStack.length - 2]))
        } else {
            dispatch(closeAllFolders())
        }
    }

    return (
        <>
            {modal.open && <Modal />}
            <div className='sm:hidden block'>
                <Grid
                    container
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Breadcrumbs maxItems={4} itemsBeforeCollapse={2} itemsAfterCollapse={2} classes={{ ol: classes.ol }}>
                        <p
                            className={`font-medium md:text-lg text-[34px] ${folderStack.length == 0 ? 'text-black' : 'cursor-pointer hover:underline'}`}
                            onClick={() => dispatch(closeAllFolders())}
                            ref={drop}
                        >
                            My Drive
                        </p>
                        {folderStack.map((folder, i) => (
                            <BreadcrumbsItem folder={folder} i={i} key={folder._id} />
                        ))}
                    </Breadcrumbs>
                    <Button
                        color={"primary"}
                        variant={"contained"}
                        className='!bg-[#1890FF] md:!px-1 md:!py-2'
                        onClick={handleClick}
                    >
                        <div className="flex gap-[10px] md:gap-1 items-center px-2 md:px-1">
                            <AiOutlinePlus color='#fff' className='text-base md:text-sm'/>
                            <p>Create</p>
                        </div>
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        elevation={3}
                        getContentAnchorEl={null}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <MenuItem onClick={handleMenuClick}>
                            <div className='flex items-center gap-2'>
                                <AiOutlineFolderAdd />
                                <p>Create folder</p>
                            </div>
                        </MenuItem>
                        <MenuItem onClick={() => {handleClose()}}>
                            <label htmlFor='uploadFile' className='flex gap-[10px] cursor-pointer items-center'>
                                <div className='flex items-center gap-2'>
                                    <AiOutlineCloudUpload />
                                    <p>Upload files</p>
                                </div>
                            </label>
                            <input type='file' id='uploadFile' hidden {...getInputProps()} />
                        </MenuItem>
                    </Menu>
                </Grid>
                <SearchInput />
            </div>
            <div className='w-full bg-slate-200 sm:flex items-center justify-between hidden md:p-3 sm:p-2'>
                <div className='flex items-center gap-3'>
                    {currentFolder && <p className='cursor-pointer' onClick={close}>🡠</p>}
                    <p className='font-medium md:text-lg text-[34px]'>
                        {currentFolder?.name? currentFolder?.name : 'My Drive'}
                    </p>
                </div>
                <SearchInput />
            </div>
            <MyDropzone getRootProps={getRootProps} isDragActive={isDragActive} />
        </>
    );
};

export default Main;