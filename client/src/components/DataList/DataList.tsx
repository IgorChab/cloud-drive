import React, { FC, useState} from 'react'
import {Menu, MenuItem, makeStyles} from '@material-ui/core'
import {AiOutlineDelete, AiOutlineDownload, AiOutlineShareAlt, AiOutlineTags} from 'react-icons/ai'
import {MdOutlineDriveFileRenameOutline} from 'react-icons/md'
import {File} from '../../interfaces/user.interface'
import {useAppDispatch} from '../../hooks/redux'
import {openPreviewFile} from '../../features/events/eventSlice'
import {openFolder} from '../../features/user/userSlice'
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import {FileTypeImage} from '../FileTypeImage/FileTypeImage'

  interface DataGridProps {
    files: File[] | []
    handleOpenShareFolder?: (folder: File) => void
  }
  
  export function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  export const DataList: FC<DataGridProps> = ({files, handleOpenShareFolder}) => {
    
    const columns: GridColDef[] = [
      { field: 'name', headerName: 'Name', width: 300, renderCell: (params) => (
          <div className='flex items-center gap-2'>
            <FileTypeImage type={params.row.type}/>
            <p>{params.row.name}</p>
          </div>
        )
      },
      { field: 'type', headerName: 'Type', width: 150},
      { field: 'date', headerName: 'Date of creation', width: 200},
      { field: 'size', headerName: 'Size'},
    ];

    const rows: GridRowsProp = files.map((file) => ({
      id: file._id,
      name: file.name,
      type: file.type,
      date: new Date(file.date).toLocaleDateString() + ', ' + new Date(file.date).toLocaleTimeString().slice(0, -3),
      size: formatBytes(file.size)
    }))
  
  const dispatch = useAppDispatch()

  const handleOpen = (params: any) => {
    if(params.row.type === 'dir'){
      const fileIndex = files.findIndex(file => file._id === params.row.id)
      if(typeof handleOpenShareFolder === "function"){
        handleOpenShareFolder(files[fileIndex])
      } else {
        dispatch(openFolder(files[fileIndex]))
      }
    } else {
      const fileIndex = files.findIndex(file => file._id === params.row.id)
      dispatch(openPreviewFile(files[fileIndex]))
    }
  }

  return (
    <div className='h-[500px]'>
      <DataGrid 
        rows={rows} 
        columns={columns}
        hideFooter
        onRowDoubleClick={handleOpen}
        disableSelectionOnClick
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
  );
}
