import React, {FC, useState} from 'react'
import { useTypedSelector, useAppDispatch } from '../../hooks/redux';
import './MyDropzone.css'
import {UploadProgressModal} from '../UploadProgressModal/UploadProgressModal'
import { CurrentFolder } from '../CurrentFolder/CurrentFolder';
import { MyDialog } from '../Dialog/Dialog';
import {useDrop} from 'react-dnd'
import {unpinFolder} from '../../features/user/userSlice'

interface DropzoneProps {
    getRootProps: any,
    isDragActive: boolean,
    serverError?: string
}

const MyDropzone: FC<DropzoneProps> = ({getRootProps, isDragActive, serverError}) => {

    const dispatch = useAppDispatch()

    const open = useTypedSelector(state => state.event.dialogOpen)

    const uploadProgressModal = useTypedSelector(state => state.event.uploadProgressModal)

    const dataList = useTypedSelector(state => state.event.dataList)

    const [{ isOver }, dropRef] = useDrop({
      accept: 'pinnedFolder',
      drop: (folder: {id: string}) => dispatch(unpinFolder(folder.id)),
      collect: (monitor) => ({
          isOver: monitor.isOver()
      })
    })

  return (
    <div className={`h-full ${!dataList  && 'overflow-auto'} ${isDragActive? 'borderAnimate' : ''}`} {...getRootProps()} ref={dropRef}>
        <div className={`grid ${!dataList && 'grid-cols-5'} gap-3 w-full`} >
            <CurrentFolder/>
        </div>
        {isDragActive && <div className={`hintUpload ${isDragActive && 'animate-bounce'}`}>Drop here to upload file</div>}
        {uploadProgressModal.open && <UploadProgressModal/>}
        {serverError && open && <MyDialog errorMsg={serverError}/>}
    </div>
  )
}

export default MyDropzone