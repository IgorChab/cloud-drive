import React, {FC, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { useAppDispatch, useTypedSelector } from '../../hooks/redux';
import { openModal } from '../../features/events/eventSlice';
import {Menu, MenuItem, makeStyles} from "@material-ui/core";
import {AiOutlineCloudUpload, AiOutlineFolderAdd} from "react-icons/ai";
import './MyDropzone.css'
import FileService from '../../app/services/fileService';
import {UploadProgressModal} from '../UploadProgressModal/UploadProgressModal'
import {openUploadProgressModal, openDialog} from '../../features/events/eventSlice'
import { CurrentFolder } from '../CurrentFolder/CurrentFolder';
import { MyDialog } from '../Dialog/Dialog';

export const MyDropzone: FC = () => {

    const dispatch = useAppDispatch()

    const open = useTypedSelector(state => state.event.dialogOpen)

    const uploadProgressModal = useTypedSelector(state => state.event.uploadProgressModal)

    const currentFolder = useTypedSelector(state => state.appInfo.currentFolder)

    const currentPath = useTypedSelector(state => state.appInfo.currentPath)

    const [serverError, setServerError] = useState('')

    const handleUpload = (acceptedFiles: any) => {
        dispatch(openUploadProgressModal(acceptedFiles))
        console.log(acceptedFiles)
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

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop: handleUpload, noClick: true, noKeyboard: true})

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
        <div className={`grid ${!dataList && 'grid-cols-5'} gap-3 w-full`}>
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
        </div>
        {isDragActive && <div className={`hintUpload ${isDragActive && 'animate-bounce'}`}>Drop here to upload file</div>}
        {uploadProgressModal.open && <UploadProgressModal/>}
        {serverError && open && <MyDialog errorMsg={serverError}/>}
    </div>
  )
}

export default MyDropzone