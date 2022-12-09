import React, {useEffect, useState} from 'react';
import {Button, Grid, Breadcrumbs, makeStyles, Menu, MenuItem} from "@material-ui/core";
import {AiOutlinePlus} from "react-icons/ai";
import SearchInput from "../SearchInput/SearchInput";
import Modal from '../Modal/Modal'
import { useAppDispatch, useTypedSelector } from '../../hooks/redux';
import { openModal } from '../../features/events/eventSlice';
import MyDropzone from '../Dropzone/MyDropzone';
import { closeFolder, closeAllFolders} from '../../features/user/userSlice';
import {AiOutlineCloudUpload, AiOutlineFolderAdd} from "react-icons/ai";
import {useDropzone} from 'react-dropzone'
import {openUploadProgressModal, openDialog} from '../../features/events/eventSlice'
import FileService from '../../app/services/fileService';
import {useDrop} from 'react-dnd'
import { BreadcrumbsItem } from '../BreadcrumbsItem/BreadcrumbsItem';
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

    const [serverError, setServerError] = useState('')

    const handleUpload = (acceptedFiles: any) => {
        dispatch(openUploadProgressModal(acceptedFiles))
        const formData = new FormData()
        formData.append('currentPath', currentPath)
        formData.append('currentFolderID', currentFolder?._id == null? currentPath : currentFolder?._id)
        FileService.uploadFiles(acceptedFiles, formData)
            .then(() => setServerError(''))
            .catch(e => {
                setServerError(e?.response?.data?.message)
                dispatch(openDialog())
            })
    }

    const handleMenuClick = () => {
        handleClose(); 
        dispatch(openModal('create'))
    }

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop: handleUpload, noClick: true, noKeyboard: true})

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
                        className={`font-medium text-[34px] ${folderStack.length == 0? 'text-black' : 'cursor-pointer hover:underline'}`}
                        onClick={() => dispatch(closeAllFolders())}
                        ref={drop}
                    >
                        My Drive
                    </p>
                    {folderStack.map((folder, i) => (
                        <BreadcrumbsItem folder={folder} i={i} key={folder._id}/>
                    ))}
                </Breadcrumbs>
                <Button 
                    color={"primary"} 
                    variant={"contained"} 
                    className='!bg-[#1890FF]'
                    onClick={handleClick}
                >
                    <div className="flex gap-[10px] items-center px-2">
                        <AiOutlinePlus size={18} color='#fff'/>
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
                            <AiOutlineFolderAdd/>
                            <p>Create folder</p>
                        </div>
                    </MenuItem>
                    <MenuItem>
                        <label htmlFor='uploadFile' className='flex gap-[10px] cursor-pointer items-center'>
                            <div className='flex items-center gap-2'>
                                <AiOutlineCloudUpload/>
                                <p>Upload files</p>
                            </div>
                        </label>
                        <input type='file' id='uploadFile' hidden {...getInputProps()}/>
                    </MenuItem>
                </Menu>
            </Grid>
            <SearchInput/>
            <MyDropzone getRootProps={getRootProps} isDragActive={isDragActive} serverError={serverError}/>
        </>
    );
};

export default Main;