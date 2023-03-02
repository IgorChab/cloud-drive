import React, {FC} from 'react'
import { FcFolder } from 'react-icons/fc'
import {FaFileVideo, FaFileAudio} from 'react-icons/fa'
import { 
    AiFillFileImage,
    AiFillFileWord,
    AiFillFilePdf,
    AiFillFileText,
    AiFillFileUnknown,
    AiFillFileExcel,
    AiFillFileZip,
    AiFillFilePpt,
} from "react-icons/ai";

const types = [
    {
        type: ['.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp'], 
        component: <AiFillFileImage color='#E67E22' size={16}/>
    },
    {
        type: ['.mpeg', '.mp4', '.ogg', '.webm'], 
        component: <FaFileVideo color='#9B59B6' size={16}/>
    },
    {
        type: ['.mp3', '.wav', '.aiff', '.au', '.raw', '.wv'],
        component: <FaFileAudio color='#2980B9' size={16}/>
    },
    {
        type: '.pdf', 
        component: <AiFillFilePdf color='red' size={16}/>
    },
    {
        type: '.txt', 
        component: <AiFillFileText color='blue' size={16}/>
    },
    {
        type: ['.docx', '.doc'], 
        component: <AiFillFileWord  color='blue' size={16}/>
    },
    {
        type: ['.xls', '.xlsx'], 
        component: <AiFillFileExcel color='teal' size={16}/>
    },
    {
        type: 'dir', component: <FcFolder size={16}/>
    },
    {
        type: ['.zip', '.7z', '.rar', '.s7z'], 
        component: <AiFillFileZip  color='#1ABC9C' size={16}/>
    },
    {
        type: ['.ppt', '.pptx'],
        component: <AiFillFilePpt  color='#ff3006' size={16}/>
    }
]


const image = ['.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp']
const video = ['.mpeg', '.mp4', '.ogg', '.webm']

interface FileTypeProps {
    type: string
    size?: number
    path?: string
}

export const FileTypeImage: FC<FileTypeProps> = ({type, size, path}) => {
    const t = types.find(el => el.type.includes(type))
    return (
        path && (image.includes(type))
        ? <>
            {image.includes(type) && 
                <div className='flex h-full'>
                    <img src={`${process.env.REACT_APP_SERVER_URL}/${path}`} className='rounded-[4px_4px_0px_0px] object-cover'/>
                </div>
            }
        </>
        : <div className='flex items-center justify-center h-full'>
            {React.cloneElement(t?.component? t.component : <AiFillFileUnknown size={16} color='#82E0AA'/>, {size: size, className: 'shrink-0'})}
        </div>
    )
}
