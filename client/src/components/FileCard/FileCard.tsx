import React, { FC, useState } from 'react'
import { File } from '../../interfaces/user.interface'
import { Menu, MenuItem, makeStyles, Snackbar, SnackbarContent, Slide, SlideProps } from "@material-ui/core";
import {
    AiOutlineDelete,
    AiOutlineDownload,
    AiOutlineShareAlt,
    AiOutlineCopy,
} from 'react-icons/ai'
import { MdOutlineDriveFileRenameOutline } from 'react-icons/md'
import { useAppDispatch, useTypedSelector } from '../../hooks/redux'
import { openModal, setCurrentFile } from '../../features/events/eventSlice'
import FileService from '../../app/services/fileService'
import { setPreviewsFile } from '../../features/user/userSlice'
import { FileTypeImage } from '../FileTypeImage/FileTypeImage'
import { useDrag } from 'react-dnd'
import { openPreviewFile } from '../../features/events/eventSlice'

interface FileCardProps {
    file: File
    hideMenu?: boolean
}

type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionUp(props: TransitionProps) {
    return <Slide {...props} direction="up" />;
}

export const FileCard: FC<FileCardProps> = ({ file, hideMenu }) => {

    const dispatch = useAppDispatch()

    const [open, setOpen] = useState<boolean>(false)

    const [collected, drag, dragPreview] = useDrag({
        type: 'file',
        item: file,
        collect: (monitor) => {
            dragPreview: monitor.isDragging()
        },
    })

    const currentPath = useTypedSelector(state => state.appInfo.currentPath)
    const currentFolder = useTypedSelector(state => state.appInfo.currentFolder)
    const preview = useTypedSelector(state => state.event.previewFile)

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
            parentFolderID: currentFolder ? currentFolder?._id : currentPath
        })
    }

    const renameBtnClick = () => {
        handleClose();
        dispatch(setCurrentFile(file));
        dispatch(openModal('rename'))
    }

    const shareBtnClick = () => {
        navigator.clipboard.writeText(`${process.env.REACT_APP_CLIENT_URL}/shareFiles/${file.shareLink}`)
        handleClose();
        setOpen(true)
    }

    const openPreview = () => {
        dispatch(setPreviewsFile(file))
        dispatch(setCurrentFile(file))
        dispatch(openPreviewFile(file))
    }

    return (
        <>
            <div
                className='flex flex-col group cursor-pointer border rounded w-[150px] h-[150px] md:text-[12px] md:w-[110px] md:h-[110px]'
                title={file.name}
                onDoubleClick={openPreview}
                onContextMenu={handleClick}
                ref={hideMenu ? undefined : drag}
            >
                <FileTypeImage type={file.type} path={file.path} className='md:text-[50px] text-[80px]'/>
                <div className='flex items-center gap-2 border-t w-full p-[10px] md:p-[5px] group-hover:bg-slate-100'>
                    <FileTypeImage type={file.type} />
                    <p className='whitespace-nowrap text-ellipsis overflow-hidden'>{file.name}</p>
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
                        <MenuItem className={classes.root} onClick={handleClose}>
                            <a
                                href={`${process.env.REACT_APP_SERVER_URL}/files/downloadFile/${file._id}`}
                                download
                                className='flex items-center gap-[10px]'
                            >
                                <AiOutlineDownload />
                                Download
                            </a>
                        </MenuItem>
                        <MenuItem className={classes.root} onClick={renameBtnClick}>
                            <MdOutlineDriveFileRenameOutline />
                            Rename
                        </MenuItem>
                        <MenuItem className={classes.root} onClick={shareBtnClick}>
                            <AiOutlineShareAlt />
                            Copy share link
                        </MenuItem>
                        <MenuItem className={classes.root} onClick={deleteBtnClick}>
                            <AiOutlineDelete />
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
                            action={<AiOutlineCopy size={24} />}
                            message='Link copied!'
                            style={{ backgroundColor: '#1890FF' }}
                        />
                    </Snackbar>
                </>
            }
        </>
    )
}
