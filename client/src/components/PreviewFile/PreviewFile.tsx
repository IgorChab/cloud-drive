import React, { FC, useState, useEffect } from 'react'

import { File } from '../../interfaces/user.interface'

import { closePreviewFile, openModal } from '../../features/events/eventSlice'
import { setPreviewsFile } from '../../features/user/userSlice'

import { useAppDispatch, useTypedSelector } from '../../hooks/redux'

import { HiOutlineArrowLeft } from 'react-icons/hi'
import { IoIosArrowBack } from 'react-icons/io'
import { AiOutlineDownload } from 'react-icons/ai'

import { FileTypeImage } from '../../components/FileTypeImage/FileTypeImage'
import { AttachmentByFileType } from '../AttachmentByFileType/AttachmentByFileType'

interface PreviewFileProps {
    files: File[]
}

export const PreviewFile: FC<PreviewFileProps> = ({files}) => {

    const dispatch = useAppDispatch()

    const previewFile = useTypedSelector(state => state.appInfo.previewFile)

    // const files = useTypedSelector(state => state.appInfo.files)

    const [filesWithoutFolders, setFilesWithoutFolders] = useState<File[] | []>([])

    const closePreview = () => {
        dispatch(closePreviewFile())
    }

    const handleRenameFile = () => {
        dispatch(openModal('rename'))
    }

    useEffect(() => {
        setFilesWithoutFolders(files.filter(file => file.type !== 'dir'))
    }, [files])

    const handlePrevious = () => {
        const currentFileIndex: number = filesWithoutFolders.findIndex(el => el._id === previewFile!._id)
        const previousFileIndex = currentFileIndex === 0 ? filesWithoutFolders.length - 1 : currentFileIndex - 1
        const newPreviewFile = filesWithoutFolders[previousFileIndex]
        dispatch(setPreviewsFile(newPreviewFile))
    }

    const handleNext = () => {
        const currentFileIndex: number = filesWithoutFolders.findIndex(el => el._id === previewFile!._id)
        const nextFileIndex = currentFileIndex === filesWithoutFolders.length - 1 ? 0 : currentFileIndex + 1
        const newPreviewFile = filesWithoutFolders[nextFileIndex]
        dispatch(setPreviewsFile(newPreviewFile))
    }

    return (
        <div className='absolute inset-0 bg-black/80 z-50 select-none'>
            <div className='w-full h-full'>
                <div className='flex h-[70px] px-5 items-center justify-between w-full absolute'>
                    <div className='flex items-center gap-3'>
                        <HiOutlineArrowLeft onClick={closePreview} color='#fff' cursor='pointer' size={20} title='Close' />
                        <FileTypeImage type={previewFile!.type} size={20} />
                        <p
                            className='text-white cursor-pointer'
                            onClick={handleRenameFile}
                        >
                            {previewFile!.name}
                        </p>
                    </div>
                    <a
                        href={`${process.env.REACT_APP_SERVER_URL}/files/downloadFile/${previewFile!._id}`}
                        download
                    >
                        <AiOutlineDownload color='#fff' cursor='pointer' size={20} title='Download' />
                    </a>
                </div>
                <div className='flex px-5 justify-between items-center h-full'>
                    <div
                        title='Previous'
                        className='w-[50px] h-[50px] flex items-center justify-center rounded-full bg-black/90 hover:bg-[#1890FF] transition cursor-pointer'
                        onClick={handlePrevious}
                    >
                        <IoIosArrowBack className='text-white group-hover:text-[#1890FF]' />
                    </div>
                    <div className='flex items-center justify-center h-[80%] w-[80%]'>
                        <AttachmentByFileType />
                    </div>
                    <div
                        title='Next'
                        className='w-[50px] h-[50px] flex items-center justify-center rounded-full bg-black/90 hover:bg-[#1890FF] transition cursor-pointer'
                        onClick={handleNext}
                    >
                        <IoIosArrowBack className='rotate-180 text-white' />
                    </div>
                </div>
            </div>
        </div>
    )
}
