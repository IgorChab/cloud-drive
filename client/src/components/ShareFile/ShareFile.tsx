import React, {useState, useEffect} from 'react'
import {Button, Breadcrumbs, makeStyles} from '@material-ui/core'
import useMediaQuery from '@mui/material/useMediaQuery';
import Folder from '../Folder/Folder'
import { FileCard } from '../FileCard/FileCard'
import { DataList } from '../DataList/DataList'
import {TbGridDots} from 'react-icons/tb'
import {AiOutlineUnorderedList} from "react-icons/ai";
import axios from 'axios'
import {useParams, Link} from 'react-router-dom'
import {File} from '../../interfaces/user.interface'
import { AiOutlineDownload } from 'react-icons/ai'

import { PreviewFile } from '../PreviewFile/PreviewFile';
import { useTypedSelector } from '../../hooks/redux'

export const ShareFile = () => {

    const handleDataList = () => {
        setDataList(!dataList)
    }

    const useStyles = makeStyles({
        ol: {
            display: 'flex',
            alignItems: 'baseline'
        },
    })

    const classes = useStyles()

    const [dataList, setDataList] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [rootFolder, setRootFolder] = useState<File | null>(null)
    const [err, setErr] = useState('')
    const [folderStack, setFolderStack] = useState<File[]>([])
    const [currentFolder, setCurrentFolder] = useState<File | null>(null)
    const {link} = useParams()

    const preview = useTypedSelector(state => state.event.previewFile)

    interface ShareFileResponse {
        currentFolder: File,
        files: File[]
    }

    const getShareFile = () => {
        axios.get<ShareFileResponse>(`${process.env.REACT_APP_SERVER_URL}/files/shareFiles/${link}`).then(res => {
            setFiles(res.data.files)
            setRootFolder(res.data.currentFolder)
            setCurrentFolder(res.data.currentFolder)
        }).catch(err => {
            setErr(err.response.data.message)
        })
    }

    useEffect(() => {
        getShareFile()
    }, [])

    const getCurrentFolder = (folder: File) => {
        setFolderStack([...folderStack, folder])
        axios.get<File>(`${process.env.REACT_APP_SERVER_URL}/files/getCurrentFolder/${folder._id}`).then(res => {
            setFiles(res.data.childs)
        })
        setCurrentFolder(folder)
    }

    const getRootFolder = () => {
        setFolderStack([])
        getShareFile()
    }
    
    const closeFolder = (folder: File) => {
        if(folder._id !== currentFolder?._id){
            let newFolderStack = [...folderStack].slice(0, folderStack.findIndex(file => file._id === folder._id) + 1)
            setFolderStack(newFolderStack)
            getCurrentFolder(newFolderStack[newFolderStack.length - 1])
            setCurrentFolder(folder)
        }
    }

    const media = useMediaQuery('(max-width:600px)');

    const close = () => {
        if(currentFolder && folderStack.length !== 1){
            closeFolder(folderStack[folderStack.length - 2])
        } else {
            getRootFolder()
        }
    }

  return (
    <div>
        <div className='text-[#1890FF] font-medium text-lg w-full sm:p-3 p-5 shadow-md'>
            <Link to={'/'}>Virtual Drive</Link>
        </div>
        {!err && 
            <>
                <div className='font-medium sm:text-black text-lg w-full p-[15px_20px] sm:p-[5px_10px] border-b border-b-slate-400 flex justify-between items-center'>
                    <Breadcrumbs maxItems={4} itemsBeforeCollapse={2} itemsAfterCollapse={2} classes={{ol: classes.ol}}>
                        <div 
                            className={`font-medium text-[24px] flex items-center gap-2 md:text-base ${folderStack.length === 0? 'text-black' : 'cursor-pointer hover:underline sm:text-black sm:cursor-default sm:hover:no-underline'}`}
                            onClick={() => getRootFolder()}
                        >
                            {(folderStack.length !== 0 && media) && <p className='cursor-pointer' onClick={close}>🡠</p>}
                            {media? currentFolder?.name : rootFolder?.name}
                        </div>
                        {!media && folderStack.map((folder, i: number) => (
                            <div 
                                className={`${i == folderStack.length - 1? 'text-black' : 'cursor-pointer hover:underline'} whitespace-nowrap text-ellipsis overflow-hidden`}
                                onClick={() => closeFolder(folder)} 
                                key={folder._id}
                            >
                                {folder.name}
                            </div>
                        ))}
                    </Breadcrumbs>
                    <div className='flex items-center'>
                        <Button color='primary' className='md:!text-sm'>
                            <a 
                                href={`${process.env.REACT_APP_SERVER_URL}/files/downloadFolder/${currentFolder?._id}`} 
                                download
                            >
                                Download all
                            </a>
                        </Button>
                        <Button onClick={handleDataList}>
                            {dataList? <TbGridDots className='text-2xl md:text-xl'/> : <AiOutlineUnorderedList className='text-2xl md:text-xl'/>}
                        </Button>
                    </div>
                </div>
                <div className={`${!dataList? 'flex flex-wrap gap-10 px-[100px] md:px-[30px] py-[50px] md:py-[20px]' : 'w-full px-[100px] py-[50px] md:px-2 md:py-3'}`}>
                    {dataList
                        ?   <DataList files={files} handleOpenShareFolder={getCurrentFolder}/> 
                        :   files.map((file) => (
                                file.type == 'dir'
                                ? 
                                    <div key={file?._id} className='relative w-[150px] h-[150px] md:text-[12px] md:w-[110px] md:h-[110px] select-none' onDoubleClick={() => getCurrentFolder(file)}>
                                        <Folder file={file} hideMenu/>
                                        <a 
                                            href={`${process.env.REACT_APP_SERVER_URL}/files/downloadFolder/${file._id}`} 
                                            download
                                        >
                                            <div className='bg-slate-400 flex items-center justify-center rounded-full w-6 h-6 !absolute !top-1 !right-1 cursor-pointer'>
                                                <AiOutlineDownload size={16} color='#fff'/>
                                            </div>
                                        </a>
                                    </div>
                                : 
                                    <div key={file?._id} className='relative w-[150px] h-[150px] md:text-[12px] md:w-[110px] md:h-[110px] select-none'>
                                        <FileCard file={file} key={file?._id} hideMenu/>
                                        <a 
                                            href={`${process.env.REACT_APP_SERVER_URL}/files/downloadFile/${file._id}`} 
                                            download
                                        >
                                            <div className='bg-slate-400 flex items-center justify-center rounded-full w-6 h-6 !absolute !top-1 !right-1 cursor-pointer'>
                                                <AiOutlineDownload size={16} color='#fff'/>
                                            </div>
                                        </a>
                                    </div>
                            ))
                    }
                </div>
            </>
        }
        {err && 
            <div className='flex w-full h-full items-center justify-center mt-3 text-xl italic'>
                {err}
            </div>
        }
        {preview.open && preview.file &&
            <PreviewFile files={files}/>
        }
    </div>
  )
}
