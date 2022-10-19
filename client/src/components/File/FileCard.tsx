import React, { FC } from 'react'
import { File } from '../../interfaces/user.interface'
import {Grid, Menu, MenuItem, makeStyles} from "@material-ui/core";
import {
    AiOutlineDelete, 
    AiOutlineDownload, 
    AiOutlineShareAlt, 
    AiFillFileImage,
    AiFillFilePdf
} from 'react-icons/ai'
import {  HiMusicNote } from 'react-icons/hi'
import {FaFileVideo} from 'react-icons/fa'
import {MdOutlineDriveFileRenameOutline} from 'react-icons/md'
import {useAppDispatch} from '../../hooks/redux'
import {openModal} from '../../features/events/eventSlice'

interface FileCardProps {
    file: File
}

export const FileCard: FC<FileCardProps> = ({file}) => {

    const dispatch = useAppDispatch()

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
    <Grid item xs={2}>
            <Grid
                container
                direction={"column"}
                justifyContent={'center'}
                alignItems={'center'}
                className='!cursor-pointer'
                onContextMenu={(e) => {handleClick(e); e.stopPropagation()}}
            >
                <div className='flex items-center flex-col justify-center'>
                    {file.type.includes('image')? <AiFillFileImage size={80}/>  : ''}
                    <div className=''>
                        {file.type.includes('image')? <AiFillFileImage/>  : ''}
                        <p>{file.name}</p>
                    </div>
                </div>
            </Grid>
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
                    <AiOutlineShareAlt/>
                    Share
                </MenuItem>
                <MenuItem className={classes.root}>
                    <AiOutlineDelete/>
                    Delete
                </MenuItem>
            </Menu>
        </Grid>
  )
}
