import React, {FC, useCallback, useEffect, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {DataList} from '../DataList/DataList';
import { useAppDispatch, useTypedSelector } from '../../hooks/redux';
import { openModal } from '../../features/events/eventSlice';
import {Grid, Menu, MenuItem, makeStyles} from "@material-ui/core";
import Folder from "../Folder/Folder";
import {AiOutlineCloudUpload, AiOutlineFolderAdd} from "react-icons/ai";
import './MyDropzone.css'
import { useUploadFilesMutation } from '../../app/services/fileService';
import { FileCard } from '../FileCard/FileCard';
import {UploadProgressModal} from '../UploadProgressModal/UploadProgressModal'
import {openUploadProgressModal} from '../../features/events/eventSlice'
// import { setFiles } from '../../features/user/userSlice';
import { CurrentFolder } from '../CurrentFolder/CurrentFolder';

export const MyDropzone: FC = () => {

    const dispatch = useAppDispatch()

    const [uploadFiles, {isLoading, isError, error, data, isUninitialized, isSuccess}] = useUploadFilesMutation()

    const uploadProgressModal = useTypedSelector(state => state.event.uploadProgressModal)

    const currentFolder = useTypedSelector(state => state.appInfo.currentFolder)

    const files = useTypedSelector(state => state.appInfo.user!.files)
    //@ts-ignore
    const childFiles = useTypedSelector(state => state.appInfo.childFiles)

    const currentPath = useTypedSelector(state => state.appInfo.currentPath)

    const handleUpload = (acceptedFiles: any) => {
        dispatch(openUploadProgressModal(acceptedFiles))
        console.log(acceptedFiles)
        console.log(currentFolder)
        const formData = new FormData()
        console.log('handleUpload currentPath ==>>', currentPath)
        formData.append('currentPath', currentPath)
        formData.append('currentFolderID', currentFolder?._id == null? currentPath : currentFolder?._id)
        acceptedFiles.forEach((file: any) => {
            formData.append('files', file)
        });
        uploadFiles(formData)
        // const totalSize = acceptedFiles.reduce((acc: number, file: any) => acc + file.size, 0)
    }

    // useEffect(() => {
    //     if(data){
    //        dispatch(setFiles(data))
    //    }
    // }, [data])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop: handleUpload, noClick: true})

    const dataList = useTypedSelector(state => state.event.dataList)

    const initialState = {
        mouseX: null,
        mouseY: null,
    };
      
    const [state, setState] = React.useState<{
        mouseX: null | number;
        mouseY: null | number;
    }>(initialState);
    
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };
    
    const handleClose = () => {
        setState(initialState);
    };

    const useStyles = makeStyles({
        root: {
            gap: '10px'
        }
    })

    const classes = useStyles()
    // onContextMenu={handleClick} 
  return (
    <div className={`h-full ${!dataList  && 'overflow-auto'} ${isDragActive? 'borderAnimate' : ''}`} {...getRootProps()}>
        <div className={`grid relative ${!dataList && 'grid-cols-5'} gap-3 w-full`}>
            <Menu
                keepMounted
                open={state.mouseY !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                state.mouseY !== null && state.mouseX !== null
                    ? { top: state.mouseY, left: state.mouseX }
                    : undefined
                }
            >
                <MenuItem className={classes.root} onClick={() => {handleClose(); dispatch(openModal('create'))}}>
                    <AiOutlineFolderAdd/>
                    Create folder
                </MenuItem>
                <MenuItem className={classes.root}>
                    <label htmlFor='uploadFile' className='flex gap-[10px] items-center'>
                        <AiOutlineCloudUpload/>
                        Upload files
                    </label>
                    <input type='file' id='uploadFile' hidden {...getInputProps()}/>
                </MenuItem>
            </Menu>
            <CurrentFolder/>
            {isDragActive && <div className='hintUpload'>Drop here to upload file</div>}
        </div>
        {!isUninitialized && uploadProgressModal.open && <UploadProgressModal error={error} data={data} isSuccess={isSuccess} isLoading={isLoading} isError={isError}/>}
    </div>
  )
}

export default MyDropzone