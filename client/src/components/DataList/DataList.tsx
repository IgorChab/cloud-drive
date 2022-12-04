import React, { FC, useState} from 'react'
import {Menu, MenuItem, makeStyles} from '@material-ui/core'
import {AiOutlineDelete, AiOutlineDownload, AiOutlineShareAlt, AiOutlineTags} from 'react-icons/ai'
import {MdOutlineDriveFileRenameOutline} from 'react-icons/md'
import {File} from '../../interfaces/user.interface'
import {useAppDispatch} from '../../hooks/redux'
import {openModal, setCurrentFile} from '../../features/events/eventSlice'
import {openFolder} from '../../features/user/userSlice'
import { DataGrid, GridRowsProp, GridColDef} from '@mui/x-data-grid';
import {FileTypeImage} from '../FileTypeImage/FileTypeImage'

  interface DataGridProps {
    files: File[] | []
  }
  
  export function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  export const DataList: FC<DataGridProps> = ({files}) => {
    
    const columns: GridColDef[] = [
      { field: 'name', headerName: 'Name', width: 300, renderCell: (params) => (
          <div className='flex items-center gap-2'>
            <FileTypeImage type={params.row.type}/>
            <p>{params.row.name}</p>
          </div>
        )
      },
      { field: 'type', headerName: 'Type'},
      { field: 'date', headerName: 'Date of creation', width: 250},
      { field: 'size', headerName: 'Size'},
    ];

    const rows: GridRowsProp = files.map((file) => ({
      id: file._id,
      name: file.name,
      type: file.type,
      date: new Date(file.date).toUTCString(),
      size: formatBytes(file.size)
    }))
  
    const dispatch = useAppDispatch()

    const initialState = {
        mouseX: null,
        mouseY: null,
      };
      
    const [state, setState] = useState<{
        mouseX: null | number;
        mouseY: null | number;
    }>(initialState);
    
    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        console.log(event)
        let target = event.target as HTMLElement;
        console.log(target.innerHTML);
        // dispatch(setCurrentFile(file))
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

  const handleOpen = (params: any) => {
    if(params.row.type === 'dir'){
      const fileIndex = files.findIndex(file => file._id === params.row.id)
      dispatch(openFolder(files[fileIndex]))
    }
  }

  return (
    <>
      <div className='overflow-auto' onContextMenu={handleClick}>
        <DataGrid 
          rows={rows} 
          columns={columns}
          autoHeight
          checkboxSelection
          hideFooter
          onRowDoubleClick={handleOpen}
          disableSelectionOnClick
          density='comfortable'
          sx={{
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
              outline: "none !important",
            },
            "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus-within": {
              outline: "none !important",
            },
            "&.MuiDataGrid-root .MuiDataGrid-cell": {
              cursor: "pointer"
            },
            '&.MuiDataGrid-root .MuiDataGrid-columnSeparator': {
              visibility: 'hidden',
          },
        }}
        />
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
          <MenuItem className={classes.root}>
              <AiOutlineDelete/>
              Delete
          </MenuItem>
      </Menu>
    </>
  );
}
