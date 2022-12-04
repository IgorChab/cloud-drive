import React, { FC, useEffect } from 'react'
import {File} from '../../interfaces/user.interface'
import {useDrop} from 'react-dnd'
import {useTypedSelector, useAppDispatch} from '../../hooks/redux'
import { closeFolder, closeAllFolders, setFiles} from '../../features/user/userSlice';
import FileService from '../../app/services/fileService'

interface BreadcrumbsItemProps {
    folder: File
    i: number
}
export const BreadcrumbsItem: FC<BreadcrumbsItemProps> = ({folder, i}) => {

    const dispatch = useAppDispatch()

    const folderStack = useTypedSelector(state => state.appInfo.folderStack)
    const currentFolder = useTypedSelector(state => state.appInfo.currentFolder)
    const currentPath = useTypedSelector(state => state.appInfo.currentPath)

    const [{ isOver }, drop] = useDrop({
        accept: 'file',
        drop: (movingFile: File) => {
            //@ts-ignore
            if(!folder.childs.includes(movingFile._id)){
                FileService.moveFile({
                    movingFileId: movingFile._id,
                    targetFolderId: folder._id,
                    parentFolderId: currentFolder?._id || currentPath
                })
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        })
    })

  return (
    <div 
        className={`${i == folderStack.length - 1? 'text-black' : 'cursor-pointer hover:underline'} whitespace-nowrap text-ellipsis overflow-hidden`}
        onClick={() => dispatch(closeFolder(folder))}
        key={folder._id}
        ref={drop}
    >
        {folder.name}
    </div>
  )
}
