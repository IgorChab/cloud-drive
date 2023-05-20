import React, {FC} from 'react'
import {IoCloseOutline} from 'react-icons/io5'
import {AiOutlineFile, AiOutlineLoading, AiFillCheckCircle} from 'react-icons/ai'
import {BiErrorCircle} from 'react-icons/bi'
import {Button} from '@material-ui/core'
import {useAppDispatch, useTypedSelector} from '../../hooks/redux'
import {closeUploadProgressModal} from '../../features/events/eventSlice'
import {FileTypeImage} from '../FileTypeImage/FileTypeImage'
import {controller} from '../../app/services/fileService'

export const UploadProgressModal: FC = () => {

    const dispatch = useAppDispatch()

    const uploadInfo = useTypedSelector(state => state.event.uploadProgressModal)

    const handleFetchClose = () => {
        dispatch(closeUploadProgressModal()); 
        controller.abort()
    }

  return (
    <div className='absolute inset-0' onContextMenu={e => e.stopPropagation()} onClick={() => dispatch(closeUploadProgressModal())}>
        <div className='absolute w-[350px] bottom-0 right-[50px] z-[100] shadow-2xl'>
            <div className='bg-black text-gray-300 rounded-[4px_4px_0_0] flex items-center justify-between p-[15px_20px]'>
                {uploadInfo.status == 'loading' && <p>Uploading {uploadInfo.files?.length} files...</p>}
                {uploadInfo.status == 'success' && <p>Uploaded {uploadInfo.files?.length} files</p>}
                {uploadInfo.status == 'error' && <p>Files not uploaded</p>}
            </div>
            {uploadInfo.status == 'loading' && 
                <div className='flex items-center justify-between p-[2px_20px] bg-blue-50'>
                    <p>Starting upload...</p>
                    <Button 
                        variant='text' 
                        color='secondary' 
                        onClick={handleFetchClose}>
                        cancel
                    </Button>
                </div>
            }
            <div className='flex flex-col bg-white justify-between p-[15px_20px] max-h-[500px] overflow-auto'>
                {uploadInfo.files && uploadInfo.files.map(file => (
                    <div className='flex flex-col mb-1' key={file.name}>
                        <div className='flex items-center justify-between gap-2'>
                            <div className='flex items-center gap-2'>
                                <FileTypeImage type={`.${file.name.split('.')[file.name.split('.').length - 1]}`}/>
                                <p className='w-[250px] text-ellipsis overflow-hidden whitespace-nowrap'>{file.name}</p>
                            </div>
                            {uploadInfo.status == 'loading' && <AiOutlineLoading className='animate-spin text-blue-400' size={24}/>}
                            {uploadInfo.status == 'success' && <AiFillCheckCircle size={24} className='text-green-500'/>}
                            {uploadInfo.status == 'error' && <BiErrorCircle size={24} className='text-red-500'/>}
                        </div>
                    </div>
                ))}
                {uploadInfo.status === 'error' && <p className='text-red-500'>Error: {uploadInfo.error}</p>}
            </div>
        </div>
    </div>
  )
}
