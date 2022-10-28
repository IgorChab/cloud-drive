import React, { useEffect } from 'react'
import Folder from '../Folder/Folder'
import { FileCard } from '../FileCard/FileCard'
import { DataList } from '../DataList/DataList'
import { useTypedSelector } from '../../hooks/redux'
import {useLazyGetCurrentFolderQuery} from '../../app/services/fileService'

export const CurrentFolder = () => {
    
    const currentFolder = useTypedSelector(state => state.appInfo.currentFolder)
    const currentPath = useTypedSelector(state => state.appInfo.currentPath)
    const folderStack = useTypedSelector(state => state.appInfo.folderStack)
    const dataList = useTypedSelector(state => state.event.dataList)
    const userID = useTypedSelector(state => state.appInfo.user!._id)
    const [getCurrentFolder, {data}] = useLazyGetCurrentFolderQuery()

    useEffect(() => {
        getCurrentFolder(userID)
    }, [currentPath == userID && currentPath])

    useEffect(() => {
        if(currentFolder){
            getCurrentFolder(currentFolder._id || userID)
        }
    }, [currentFolder, currentPath, folderStack])
    
  return (
    <>
        {dataList
            ?   <DataList files={data?.childs || []}/> 
            // :   data && data.childs
            //         ?   data?.childs.map((file: any) => (
            //                 file.type == 'dir'
            //                 ? <Folder file={file} key={file?._id}/>
            //                 : <FileCard file={file} key={file?._id}/>
            //             ))
                    :   data && data.childs.map((file: any) => (
                            file.type == 'dir'
                            ? <Folder file={file} key={file?._id}/>
                            : <FileCard file={file} key={file?._id}/>
                        ))
        }
    </>
  )
}
