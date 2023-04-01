import React, {FC, useState} from 'react'
import { useTypedSelector, useAppDispatch } from '../../hooks/redux';
import './MyDropzone.css'
import {UploadProgressModal} from '../UploadProgressModal/UploadProgressModal'
import { CurrentFolder } from '../CurrentFolder/CurrentFolder';
import {useDrop} from 'react-dnd'
import {unpinFolder} from '../../features/user/userSlice'

interface DropzoneProps {
    getRootProps: any,
    isDragActive: boolean,
}

const MyDropzone: FC<DropzoneProps> = ({getRootProps, isDragActive}) => {

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
    <div {...getRootProps({
        className: `h-full ${!dataList && 'overflow-y-auto pr-2'} ${isDragActive? 'borderAnimate' : ''}`,
        ref: dropRef
      })}
    >
        <div className={`w-full sm:p-2 ${!dataList && 'flex gap-3 flex-wrap'}`}>
            <CurrentFolder/>
        </div>
        {uploadProgressModal.open && <UploadProgressModal/>}
    </div>
  )
}

export default MyDropzone