import React, { FC, useState} from 'react'
import { File } from '../../interfaces/user.interface'
import {Menu, MenuItem, makeStyles, Snackbar, SnackbarContent, Slide, SlideProps} from "@material-ui/core";
import {
    AiOutlineDelete, 
    AiOutlineDownload, 
    AiOutlineShareAlt,
    AiOutlineCopy
} from 'react-icons/ai'
import {MdOutlineDriveFileRenameOutline} from 'react-icons/md'
import {useAppDispatch, useTypedSelector} from '../../hooks/redux'
import {openModal, setCurrentFile} from '../../features/events/eventSlice'
import FileService from '../../app/services/fileService'
import {deleteFile} from '../../features/user/userSlice'
import {FileTypeImage} from '../FileTypeImage/FileTypeImage'
import {useDrag} from 'react-dnd'

interface FileCardProps {
    file: File
}

type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up"/>;
}

export const FileCard: FC<FileCardProps> = ({file}) => {

    const dispatch = useAppDispatch()
    
    const [open, setOpen] = useState(false)

    const [collected, drag, dragPreview] = useDrag({
        type: 'file',
        item: file,
        collect: (monitor) => {
            dragPreview: monitor.isDragging()
        },
    })

    const currentPath = useTypedSelector(state => state.appInfo.currentPath)
    const currentFolder = useTypedSelector(state => state.appInfo.currentFolder)
   
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

    const deleteBtnClick = () => {
        handleClose();
        FileService.deleteFile({
            id: file._id, 
            parentFolderID: currentFolder? currentFolder?._id : currentPath
        })
    }

    const renameBtnClick = () => {
        handleClose(); 
        dispatch(setCurrentFile(file)); 
        dispatch(openModal('rename'))
    }

    const downloadBtnClick = () => {
        handleClose(); 
    }

    const shareBtnClick = () => {
        navigator.clipboard.writeText(`http://localhost:3000/shareFiles/${file.shareLink}`)
        handleClose(); 
        setOpen(true)
    }

  return (
    <>
        <div 
            className='flex flex-col group cursor-pointer border rounded'
            title={file.name}
            onContextMenu={handleClick}
            ref={drag}
        >
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
            <MenuItem className={classes.root} onClick={downloadBtnClick}>
                <AiOutlineDownload/>
                Download
            </MenuItem>
            <MenuItem className={classes.root} onClick={renameBtnClick}>
                <MdOutlineDriveFileRenameOutline/>
                Rename
            </MenuItem>
            <MenuItem className={classes.root} onClick={shareBtnClick}>
                <AiOutlineShareAlt/>
                Copy share link
            </MenuItem>
            <MenuItem className={classes.root} onClick={deleteBtnClick}>
                <AiOutlineDelete/>
                Delete
            </MenuItem>
        </Menu>
        <Snackbar
            open={open}
            anchorOrigin={{
                horizontal: 'center',
                vertical: 'bottom'
            }}
            onClose={() => setOpen(false)}
            autoHideDuration={3000}
            TransitionComponent={TransitionUp}
        >
            <SnackbarContent
                action={<AiOutlineCopy size={24}/>}
                message='Link copied!'
                style={{backgroundColor: '#1890FF'}}
            />
        </Snackbar>  
    </>
  )
}
