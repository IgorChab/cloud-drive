import React, {FC, useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {DataList} from '../DataList/DataList';
import { useAppDispatch, useTypedSelector } from '../../hooks/redux';
import { openModal } from '../../features/events/eventSlice';
import {Grid, Menu, MenuItem, makeStyles} from "@material-ui/core";
import Folder from "../Folder/Folder";
import {AiOutlineCloudUpload, AiOutlineFolderAdd} from "react-icons/ai";
import './MyDropzone.css'
import { useUploadFilesMutation } from '../../app/services/fileService';
import { setStorageInfo, setFiles } from '../../features/files/fileSlice';
import { FileCard } from '../File/FileCard';
export const MyDropzone: FC = () => {

    const [uploadFiles, {isLoading, isError, data}] = useUploadFilesMutation()

    const user = useTypedSelector(state => state.auth.user)
    const files = useTypedSelector(state => state.storage.files)
    console.log('uploded files ===>>>', files)

    const currentFolder = useTypedSelector(state => state.storage.currentFolder)
    console.log(currentFolder)

    const handleUpload = useCallback(async (acceptedFiles: any) => {
        console.log(acceptedFiles)
        const formData = new FormData()
        //@ts-ignore
        formData.append('currentFolder', currentFolder)
        acceptedFiles.forEach((file: any) => {
            formData.append('files', file)
        });
        uploadFiles(formData)
        if(data){
            dispatch(setFiles(data))
        }
        // const totalSize = acceptedFiles.reduce((acc: number, file: any) => acc + file.size, 0)
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop: handleUpload, noClick: true})

    const dispatch = useAppDispatch()

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

  return (
    <div className={`relative ${isDragActive? 'borderAnimate' : ''}`}>
        <Grid container wrap={"wrap"} className='foldersContainer' onContextMenu={handleClick} {...getRootProps()}>
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
            {dataList
                ? <DataList files={files}/> 
                : files.map(file => (
                    file.type == 'dir'
                    ? <Folder file={file} key={file?._id}/>
                    : <FileCard file={file} key={file?._id}/>
                ))
            }
            {isDragActive
                ? <div className='hintUpload'>
                    Drop here to upload file
                </div>
                : ''
            }
        </Grid>
    </div>
  )
}

export default MyDropzone