import React, { FC, useState} from 'react'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Menu, MenuItem, makeStyles} from '@material-ui/core'
import {AiOutlineDelete, AiOutlineDownload, AiOutlineShareAlt, AiOutlineTags} from 'react-icons/ai'
import {MdOutlineDriveFileRenameOutline} from 'react-icons/md'
import {File} from '../../interfaces/user.interface'
import {FcFolder} from "react-icons/fc";
import {useAppDispatch} from '../../hooks/redux'
import {openModal, setCurrentFile} from '../../features/events/eventSlice'

  interface DataGridProps {
    files: File[]
  }
  
  export const DataList: FC<DataGridProps> = ({files}) => {
  
    const dispatch = useAppDispatch()

    const initialState = {
        mouseX: null,
        mouseY: null,
      };
      
    const [state, setState] = useState<{
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

    return (
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell align="right">Items</TableCell>
              <TableCell align="right">Size</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file: any) => (
              <TableRow key={file._id} className='cursor-pointer' onContextMenu={(e) => {handleClick(e, file); e.stopPropagation()}}>
                <TableCell component="th" scope="row">
                  <div className='flex gap-2 items-center py-2'>
                    {file.type == 'dir'? <FcFolder/> : ''}
                    {file.name}
                  </div>
                </TableCell>
                <TableCell align="right">{file.type}</TableCell>
                <TableCell align="right">{file.childs.length}</TableCell>
                <TableCell align="right">{file.size}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
      </TableContainer>
    );
}
