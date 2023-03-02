import React, {useState, useEffect} from 'react'
import {Button, Breadcrumbs, makeStyles} from '@material-ui/core'
import Folder from '../Folder/Folder'
import { FileCard } from '../FileCard/FileCard'
import { DataList } from '../DataList/DataList'
import {TbGridDots} from 'react-icons/tb'
import {AiOutlineUnorderedList} from "react-icons/ai";
import axios from 'axios'
import {useParams} from 'react-router-dom'
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

    const getShareFile = (id: string | undefined) => {
        axios.get<ShareFileResponse>(`${process.env.REACT_APP_SERVER_URL}/files/shareFiles/${link}`).then(res => {
            setFiles(res.data.files)
            setRootFolder(res.data.currentFolder)
            setCurrentFolder(res.data.currentFolder)
        }).catch(err => {
            setErr(err.response.data.message)
        })
    }

    useEffect(() => {
        getShareFile(link)
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
        getShareFile(link)
    }
    
    const closeFolder = (folder: File) => {
        if(folder._id !== currentFolder?._id){
            let newFolderStack = [...folderStack].slice(0, folderStack.findIndex(file => file._id === folder._id) + 1)
            setFolderStack(newFolderStack)
            getCurrentFolder(newFolderStack[newFolderStack.length - 1])
            setCurrentFolder(folder)
        }
    }

  return (
    <div>
        <div className='text-[#1890FF] font-medium text-lg w-full p-5 shadow-md'>
            Virtual Drive
        </div>
        {!err && 
            <>
                <div className='font-medium text-lg w-full p-[15px_20px] border-b border-b-slate-400 flex justify-between items-center'>
                    <Breadcrumbs maxItems={4} itemsBeforeCollapse={2} itemsAfterCollapse={2} classes={{ol: classes.ol}}>
                        <p 
                            className={`font-medium text-[24px] ${folderStack.length == 0? 'text-black' : 'cursor-pointer hover:underline'}`}
                            onClick={() => getRootFolder()}
                        >
                            {rootFolder?.name}
                        </p>
                        {folderStack.map((folder, i: number) => (
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
                        <Button color='primary'>
                            <a 
                                href={`${process.env.REACT_APP_SERVER_URL}/files/downloadFolder/${currentFolder?._id}`} 
                                download
                            >
                                Download all
                            </a>
                        </Button>
                        <Button onClick={handleDataList}>
                            {dataList? <TbGridDots size={24}/> : <AiOutlineUnorderedList size={24}/>}
                        </Button>
                    </div>
                </div>
                <div className={`${!dataList && `flex gap-10`} w-full px-[100px] py-[50px]`}>
                    {dataList
                        ?   <DataList files={files} handleOpenShareFolder={getCurrentFolder}/> 
                        :   files.map((file) => (
                                file.type == 'dir'
                                ? 
                                    <div key={file?._id} className='relative w-[150px] h-[166px] select-none' onDoubleClick={() => getCurrentFolder(file)}>
                                        <Folder file={file} hideMenu/>
                                        <a 
                                            href={`${process.env.REACT_APP_SERVER_URL}/files/downloadFolder/${file._id}`} 
                                            download
                                        >
                                            <div className='bg-slate-400 flex items-center justify-center rounded-full w-6 h-6 !absolute !top-3 !right-2 cursor-pointer'>
                                                <AiOutlineDownload size={16} color='#fff'/>
                                            </div>
                                        </a>
                                    </div>
                                : 
                                    <div key={file?._id} className='relative select-none'>
                                        <FileCard file={file} key={file?._id} hideMenu/>
                                        <a 
                                            href={`${process.env.REACT_APP_SERVER_URL}/files/downloadFile/${file._id}`} 
                                            download
                                        >
                                            <div className='bg-slate-400 flex items-center justify-center rounded-full w-6 h-6 !absolute !top-3 !right-3 cursor-pointer'>
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
            <PreviewFile/>
        }
    </div>
  )
}
