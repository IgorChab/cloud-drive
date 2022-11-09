import React, {FC} from 'react';
import {FcFolder} from "react-icons/fc";
import {Menu, MenuItem, makeStyles} from "@material-ui/core";
import {useDrag} from 'react-dnd'
import {useDrop} from 'react-dnd'
import {AiOutlineDelete, AiOutlineDownload, AiOutlineShareAlt, AiOutlineTags} from 'react-icons/ai'
import {MdOutlineDriveFileRenameOutline} from 'react-icons/md'
import {useAppDispatch, useTypedSelector} from '../../hooks/redux'
import {openModal, setCurrentFile} from '../../features/events/eventSlice'
import {File} from '../../interfaces/user.interface'
import {openFolder} from '../../features/user/userSlice'
import FileService from '../../app/services/fileService'
import {formatBytes} from '../DataList/DataList'

interface Props {
    file: File
}

const Folder: FC<Props> = ({file}) => {
    
    const [collected, drag, dragPreview] = useDrag({
        type: 'folder',
        item: file,
        collect: (monitor) => {
            dragPreview: monitor.isDragging()
        },
    })

    // const [{ isOver }, dropRef] = useDrop({
    //     accept: 'file',
    //     drop: (item: File) => {},
    //     collect: (monitor) => ({
    //         isOver: monitor.isOver()
    //     })
    // })

    const dispatch = useAppDispatch()

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
    
    const handleClick = (event: React.MouseEvent<HTMLDivElement>, file: File) => {
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

    const deleteBtnClick = () => {
        handleClose();
        FileService.deleteFile({
            id: file._id, 
            parentFolderID: currentFolder? currentFolder?._id : currentPath
        })
    }

    return (
        <>
            <div
                className='cursor-pointer flex flex-col items-center'
                ref={drag}
                onContextMenu={(e) => {handleClick(e, file); e.stopPropagation()}}
                onDoubleClick={() => {dispatch(openFolder(file)); dispatch(setCurrentFile(file))}}
            >
                <FcFolder size={100}/>
                <div className='flex items-center flex-col text-base mt-[-10px]'>
                    <p className='font-medium text-lg text-black/[85%]'>{file.name}</p>
                    <p className='text-black/[45%] font-bold'>{file.childs.length} Items</p>
                    <p className='font-bold text-black/[25%] capitalize'>{formatBytes(file.size)}</p>
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
                <MenuItem className={classes.root}>
                    <AiOutlineDownload/>
                    Download
                </MenuItem>
                <MenuItem className={classes.root} onClick={() => {handleClose(); dispatch(openModal('rename'))}}>
                    <MdOutlineDriveFileRenameOutline/>
                    Rename
                </MenuItem>
                <MenuItem className={classes.root}>
                    <AiOutlineTags/>
                    Add tag
                </MenuItem>
                <MenuItem className={classes.root}>
                    <AiOutlineShareAlt/>
                    Share
                </MenuItem>
                <MenuItem className={classes.root} onClick={deleteBtnClick}> 
                    <AiOutlineDelete/>
                    Delete
                </MenuItem>
            </Menu>
        </>
    );
};

export default Folder;