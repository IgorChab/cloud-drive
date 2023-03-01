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

    console.log(isDragActive)

  return (
    <div {...getRootProps({
        className: `h-full ${!dataList && 'overflow-y-auto pr-2'} ${isDragActive? 'borderAnimate' : ''}`,
        ref: dropRef
      })}
    >
        <div className={`grid ${!dataList && 'grid-cols-5 2xl:grid-cols-7'} gap-3 2xl:gap-6`}>
            <CurrentFolder/>
        </div>
        {/* {isDragActive &&
          <div className='absolute inset-0 flex items-end justify-center pb-[10%]'>
            <div className={`hintUpload ${isDragActive && 'animate-bounce'}`}>Drop here to upload file</div>
          </div>
        } */}
        {uploadProgressModal.open && <UploadProgressModal/>}
    </div>
  )
}

export default MyDropzone