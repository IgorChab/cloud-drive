import React, {FC} from 'react';
import {FcFolder} from "react-icons/fc";
import {Grid, Menu, MenuItem, makeStyles} from "@material-ui/core";
import {useDrag} from 'react-dnd'
import {AiOutlineDelete, AiOutlineDownload, AiOutlineShareAlt, AiOutlineTags} from 'react-icons/ai'
import {MdOutlineDriveFileRenameOutline} from 'react-icons/md'
import {useAppDispatch} from '../../hooks/redux'
import {openModal} from '../../features/events/eventSlice'
import {File} from '../../interfaces/user.interface'

interface Props {
    file: File
}

const Folder: FC<Props> = ({file}) => {
    
    //@ts-ignore
    const [collected, drag, dragPreview] = useDrag({
        type: 'folder',
        item: file,
        collect: (monitor) => {
            dragPreview: monitor.isDragging()
        },
    })

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
                ref={drag}
                onContextMenu={(e) => {handleClick(e); e.stopPropagation()}}
            >
                <FcFolder size={100}/>
                <div className='flex items-center flex-col gap-2 text-base'>
                    <p className='font-medium text-xl text-black/[85%]'>{file.name}</p>
                    <p className='text-black/[45%] font-bold'>{file.childs.length} Items</p>
                    <p className='font-bold text-black/[25%] uppercase'>{file.size} mb</p>
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
                    <AiOutlineTags/>
                    Add tag
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
    );
};

export default Folder;