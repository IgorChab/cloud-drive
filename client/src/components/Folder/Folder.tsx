import React, {FC, useState} from 'react';
import {FcFolder} from "react-icons/fc";
import {Menu, MenuItem, makeStyles, Snackbar, Slide, SlideProps, SnackbarContent} from "@material-ui/core";
import {useDrag} from 'react-dnd'
import {useDrop} from 'react-dnd'
import {AiOutlineDelete, AiOutlineDownload, AiOutlineShareAlt, AiOutlineTags, AiOutlineCopy} from 'react-icons/ai'
import {MdOutlineDriveFileRenameOutline} from 'react-icons/md'
import {useAppDispatch, useTypedSelector} from '../../hooks/redux'
import {openModal, setCurrentFile} from '../../features/events/eventSlice'
import {File} from '../../interfaces/user.interface'
import {openFolder} from '../../features/user/userSlice'
import FileService from '../../app/services/fileService'
import {formatBytes} from '../DataList/DataList'

interface Props {
    file: File
    hideMenu?: boolean
}

type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up"/>;
}

const Folder: FC<Props> = ({file, hideMenu}) => {

    const dispatch = useAppDispatch()

    const [open, setOpen] = useState(false)

    const currentPath = useTypedSelector(state => state.appInfo.currentPath)
    const currentFolder = useTypedSelector(state => state.appInfo.currentFolder)
    
    const [collected, drag, dragPreview] = useDrag({
        type: 'file',
        item: file,
        collect: (monitor) => {
            dragPreview: monitor.isDragging()
        },
    })

    const [{ isOver }, drop] = useDrop({
        accept: 'file',
        drop: (movingFile: File) => {
            if(movingFile._id !== file._id){
                FileService.moveFile({
                    parentFolderId: currentFolder?._id || currentPath,
                    movingFileId: movingFile._id,
                    targetFolderId: file._id
                })
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    })

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
        dispatch(setCurrentFile(file))
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

    const handleDoubleClick = () => {
        dispatch(openFolder(file));
        dispatch(setCurrentFile(file))
    }

    const deleteBtnClick = () => {
        handleClose();
        FileService.deleteFile({
            id: file._id, 
            parentFolderID: currentFolder? currentFolder?._id : currentPath
        })
    }

    const renameBtnClick = () => {
        handleClose(); 
        dispatch(openModal('rename'))
    }

    const shareBtnClick = () => {
        navigator.clipboard.writeText(`http://localhost:3000/shareFiles/${file.shareLink}`)
        handleClose(); 
        setOpen(true)
    }

    return (
        <>
            <div
                className='cursor-pointer flex flex-col items-center'
                ref={(node) => hideMenu? undefined : drag(drop(node))}
                title={file.name}
                onContextMenu={handleClick}
                onDoubleClick={handleDoubleClick}
            >
                <FcFolder size={100} color={'red'}/>
                <div className='flex items-center flex-col text-base mt-[-10px]'>
                    <p className='font-medium text-lg text-black/[85%] whitespace-nowrap text-ellipsis overflow-hidden w-[100px] text-center'>{file.name}</p>
                    <p className='text-black/[45%] font-bold'>{file.childs.length} Items</p>
                    <p className='font-bold text-black/[25%] capitalize'>{formatBytes(file.size)}</p>
                </div>
            </div>
            {!hideMenu &&
                <>
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
                        <MenuItem className={classes.root}>
                            <a 
                                href={`http://localhost:5000/files/downloadFolder/${file._id}`} 
                                download
                                className='flex items-center gap-[10px]'
                            >
                                <AiOutlineDownload/>
                                Download
                            </a>
                        </MenuItem>
                        <MenuItem className={classes.root} onClick={renameBtnClick}>
                            <MdOutlineDriveFileRenameOutline/>
                            Rename
                        </MenuItem>
                        <MenuItem className={classes.root}>
                            <AiOutlineTags/>
                            Add tag
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
            } 
        </>
    );
};

export default Folder;