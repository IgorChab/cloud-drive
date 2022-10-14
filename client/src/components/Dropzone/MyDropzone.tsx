import React, {FC, PropsWithChildren, useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {DataGrid} from '../DataGrid/DataGrid';
import { useAppDispatch, useTypedSelector } from '../../hooks/redux';
import { openModal } from '../../features/events/eventSlice';
import {Grid, Menu, MenuItem, makeStyles} from "@material-ui/core";
import Folder from "../Folder/Folder";
import {AiOutlineCloudUpload, AiOutlineFolderAdd} from "react-icons/ai";
import './MyDropzone.css'
export const MyDropzone: FC<PropsWithChildren> = ({children}) => {

  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles)
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, noClick: true})

  const dispatch = useAppDispatch()

    const modal = useTypedSelector(state => state.event.modal)
    const dataGrid = useTypedSelector(state => state.event.dataGrid)

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

    const [folders, setFolders] = useState([
        {id: 1, name: 'Slides', items: 12, space: '100mb'}
    ])

  return (
    <div className={`default ${isDragActive? 'borderAnimate' : ''}`}>
      {dataGrid
            ? <DataGrid folders={folders}/> 
            :
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
                        <label htmlFor='uploadFile' className='uploadInput'>
                            <AiOutlineCloudUpload/>
                            Upload files
                        </label>
                        <input type='file' id='uploadFile' hidden {...getInputProps()}/>
                    </MenuItem>
                </Menu>
                {folders.map(folder => (
                    <Folder items={folder.items} name={folder.name} space={folder.space} key={folder.id}/>
                ))}
                {isDragActive
                  ? <div className='hintUpload'>
                      Drop here to upload file
                    </div>
                  : ''
                }
            </Grid>
        }
    </div>
  )
}

export default MyDropzone