import React, { useEffect, useState, useLayoutEffect } from 'react'
import Folder from '../Folder/Folder'
import { FileCard } from '../FileCard/FileCard'
import { DataList } from '../DataList/DataList'
import { PreviewFile } from '../PreviewFile/PreviewFile';
import { useTypedSelector, useAppDispatch } from '../../hooks/redux'
import FileService from '../../app/services/fileService'

export const CurrentFolder = () => {

    const currentFolder = useTypedSelector(state => state.appInfo.currentFolder)
    const currentPath = useTypedSelector(state => state.appInfo.currentPath)
    const files = useTypedSelector(state => state.appInfo.files)
    const dataList = useTypedSelector(state => state.event.dataList)
    const filterFiles = useTypedSelector(state => state.appInfo.filterFiles)
    const filter = useTypedSelector(state => state.appInfo.filter)
    const preview = useTypedSelector(state => state.event.previewFile)

    useEffect(() => {
        FileService.getCurrentFolder(currentFolder?._id || currentPath)
    }, [currentFolder])
    
  return (
    <>
        {dataList
            ?   <DataList files={filter? filterFiles : files}/> 
            :   filter
                  ? filterFiles.map((file: any) => (
                      file.type == 'dir'
                      ? <Folder file={file} key={file?._id}/>
                      : <FileCard file={file} key={file?._id}/>
                  ))
                  : files && files.map((file: any) => (
                      file.type == 'dir'
                      ? <Folder file={file} key={file?._id}/>
                      : <FileCard file={file} key={file?._id}/>
                  ))
        }
        {preview.open && preview.file &&
            <PreviewFile files={files}/>
        }
    </>
  )
}
