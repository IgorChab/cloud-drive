import React, { FC, useState} from 'react'
import {File} from '../../interfaces/user.interface'
import {useAppDispatch, useTypedSelector} from '../../hooks/redux'
import {openPreviewFile} from '../../features/events/eventSlice'
import {openFolder} from '../../features/user/userSlice'
import { DataGrid, GridRowsProp, GridColDef, GridToolbarContainer } from '@mui/x-data-grid';
import {FileTypeImage} from '../FileTypeImage/FileTypeImage'
import ExportCSV from '../ExportCSV/ExportCSV'


export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

  interface DataGridProps {
    files: File[] | []
    handleOpenShareFolder?: (folder: File) => void
  }

  export const DataList: FC<DataGridProps> = ({files, handleOpenShareFolder}) => {
    
    const currentFolder = useTypedSelector(state => state.appInfo.currentFolder)

    const columns: GridColDef[] = [
      { field: 'name', headerName: 'Name', flex: 2, renderCell: (params) => (
          <div className='flex items-center gap-2'>
            <FileTypeImage type={params.row.type}/>
            <p>{params.row.name}</p>
          </div>
        )
      },
      { field: 'type', headerName: 'Type', flex: 1,},
      { field: 'date', headerName: 'Date of creation', flex: 1,},
      { field: 'size', headerName: 'Size', flex: 1,},
    ];

    const rows: GridRowsProp = files.map((file) => ({
      id: file._id,
      name: file.name,
      type: file.type,
      date: new Date(file.date).toLocaleDateString() + ', ' + new Date(file.date).toLocaleTimeString().slice(0, -3),
      size: formatBytes(file.size)
    }))

    function CustomToolbar() {
      return (
        <GridToolbarContainer className='!flex !items-center !justify-end'>
          <ExportCSV 
            csvData={[...rows].map((el, i) => {
              return {
                ...el,
                id: i + 1
              }
            })}
            fileName={currentFolder?.name? currentFolder?.name : 'MyDrive'}
          />
        </GridToolbarContainer>
      );
    }
  
  const dispatch = useAppDispatch()

  const handleOpen = (params: any) => {
    console.log(params)
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
        components={{
          Toolbar: CustomToolbar
        }}
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
