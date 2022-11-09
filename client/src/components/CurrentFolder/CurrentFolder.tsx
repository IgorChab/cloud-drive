import React, { useEffect } from 'react'
import Folder from '../Folder/Folder'
import { FileCard } from '../FileCard/FileCard'
import { DataList } from '../DataList/DataList'
import { useTypedSelector, useAppDispatch } from '../../hooks/redux'
import FileService from '../../app/services/fileService'

export const CurrentFolder = () => {

    const currentFolder = useTypedSelector(state => state.appInfo.currentFolder)
    const currentPath = useTypedSelector(state => state.appInfo.currentPath)
    const files = useTypedSelector(state => state.appInfo.files)
    const dataList = useTypedSelector(state => state.event.dataList)

    useEffect(() => {
        FileService.getCurrentFolder(currentFolder?._id || currentPath)
    }, [currentFolder])

    console.log(files)
    
  return (
    <>
        {dataList
            ?   <DataList files={files}/> 
            :   files.map((file: any) => (
                    file.type == 'dir'
                    ? <Folder file={file} key={file?._id}/>
                    : <FileCard file={file} key={file?._id}/>
                ))
        }
    </>
  )
}
