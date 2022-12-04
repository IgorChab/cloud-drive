import React, {useState, useEffect} from 'react'
import {Button} from '@material-ui/core'
import Folder from '../Folder/Folder'
import { FileCard } from '../FileCard/FileCard'
import { DataList } from '../DataList/DataList'
import {TbGridDots} from 'react-icons/tb'
import {AiOutlineUnorderedList} from "react-icons/ai";
import axios from 'axios'
import {useParams} from 'react-router-dom'
import {File} from '../../interfaces/user.interface'
export const ShareFile = () => {

    const [dataList, setDataList] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [fileName, setFileName] = useState('')

    const {link} = useParams()

    useEffect(() => {
        axios.get(`http://localhost:5000/files/shareFiles/${link}`).then(res => {
            setFiles(res.data.files)
            setFileName(res.data.fileName)
        })
    }, [])
    
    const handleDataList = () => {
        setDataList(!dataList)
    }

  return (
    <div>
        <div className='text-[#1890FF] font-medium text-lg w-full p-5 shadow-md'>
            Virtual Drive
        </div>
        <div className='font-medium text-lg w-full p-[15px_20px] border-b border-b-slate-400 flex justify-between items-center'>
            <p>{fileName}</p>
            <div className='flex items-center'>
                <Button color='primary'>
                    Download all
                </Button>
                <Button onClick={handleDataList}>
                    {dataList? <TbGridDots size={24}/> : <AiOutlineUnorderedList size={24}/>}
                </Button>
            </div>
        </div>
        <div className={`grid relative ${!dataList && 'grid-cols-5'} gap-3 w-full px-[100px] py-[50px]`}>
            {dataList
                ?   <DataList files={files}/> 
                :   files.map((file: any) => (
                        file.type == 'dir'
                        ? <Folder file={file} key={file?._id}/>
                        : <FileCard file={file} key={file?._id}/>
                    ))
            }
        </div>
    </div>
  )
}
