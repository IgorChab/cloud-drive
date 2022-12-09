import React, { FC } from 'react'

import { File } from '../../interfaces/user.interface'

import { closePreviewFile } from '../../features/events/eventSlice'
import { useAppDispatch } from '../../hooks/redux'

import { HiOutlineArrowLeft } from 'react-icons/hi'
import { FileTypeImage } from '../../components/FileTypeImage/FileTypeImage'

interface PreviewFileProps {
    file: File
}

export const PreviewFile: FC<PreviewFileProps> = ({ file }) => {

    const dispatch = useAppDispatch()

    const closePreview = () => {
        dispatch(closePreviewFile())
    }

    return (
        <div className='absolute inset-0 bg-black/70 z-50'>
            <div className='w-full h-[70px] flex items-center px-7'>
                <div className='flex items-center gap-3'>
                    <HiOutlineArrowLeft onClick={closePreview} color='#fff' cursor='pointer' size={20}/>
                    <FileTypeImage type={file.type} size={20}/>
                    <p className='text-white'>{file.name}</p>
                </div>
            </div>
        </div>
    )
}
