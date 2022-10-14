import React, {FC} from 'react';
import {FcFolder} from "react-icons/fc";
import {Grid, Menu, MenuItem, makeStyles} from "@material-ui/core";
import {useDrag} from 'react-dnd'
import {AiOutlineDelete, AiOutlineDownload, AiOutlineShareAlt, AiOutlineTags} from 'react-icons/ai'
import {MdOutlineDriveFileRenameOutline} from 'react-icons/md'
import './Folder.css'
import {useAppDispatch} from '../../hooks/redux'
import {openModal} from '../../features/events/eventSlice'


interface Props {
    name: string
    items: number
    space: string
}

const Folder: FC<Props> = ({space, items, name}) => {
    //@ts-ignore
    const [collected, drag, dragPreview] = useDrag({
        type: 'folder',
        item: {name, items, space},
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
                style={{cursor: 'pointer'}}
                ref={drag}
                onContextMenu={(e) => {handleClick(e); e.stopPropagation()}}
            >
                <FcFolder size={100}/>
                <div className='folderDesc'>
                    <p className='folderName'>{name}</p>
                    <p className='folderItems'>{items} Items</p>
                    <p className='folderSpace'>{space}</p>
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