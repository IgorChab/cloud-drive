import React, { FC } from 'react'
import { File } from '../../interfaces/user.interface'
import {Menu, MenuItem, makeStyles} from "@material-ui/core";
import {
    AiOutlineDelete, 
    AiOutlineDownload, 
    AiOutlineShareAlt, 
} from 'react-icons/ai'
import {MdOutlineDriveFileRenameOutline} from 'react-icons/md'
import {useAppDispatch, useTypedSelector} from '../../hooks/redux'
import {openModal, setCurrentFile} from '../../features/events/eventSlice'
import {useLazyDeleteFileQuery, useLazyDownloadFileQuery} from '../../app/services/fileService'
// import {deleteFile} from '../../features/user/userSlice'
import {FileTypeImage} from '../FileTypeImage/FileTypeImage'

interface FileCardProps {
    file: File
}

export const FileCard: FC<FileCardProps> = ({file}) => {

    const dispatch = useAppDispatch()

    const [deleteFileQuery, {data}] = useLazyDeleteFileQuery()

    const [downloadFile, govno] = useLazyDownloadFileQuery()
   
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
    <>
        <div className='flex flex-col group cursor-pointer border rounded' title={file.name} onContextMenu={(e) => {handleClick(e); e.stopPropagation()}}>
                <FileTypeImage type={file.type} size={80} path={file.path}/>
            <div className='flex items-center gap-2 border-t w-full p-[10px] group-hover:bg-slate-100'>
                <FileTypeImage type={file.type}/>
                <p className='whitespace-nowrap text-ellipsis overflow-hidden'>{file.name}</p>
            </div>
        </div>
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
            <MenuItem className={classes.root} onClick={() => {handleClose(); downloadFile(file._id)}}>
                <AiOutlineDownload/>
                Download
            </MenuItem>
            <MenuItem className={classes.root} onClick={() => {handleClose(); dispatch(setCurrentFile(file)); dispatch(openModal('rename'))}}>
                <MdOutlineDriveFileRenameOutline/>
                Rename
            </MenuItem>
            <MenuItem className={classes.root}>
                <AiOutlineShareAlt/>
                Share
            </MenuItem>
            <MenuItem className={classes.root} onClick={() => {handleClose(); deleteFileQuery(file._id)}}>
                <AiOutlineDelete/>
                Delete
            </MenuItem>
        </Menu>
    </>
  )
}
