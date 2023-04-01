import React, { FC } from 'react'
import { AiOutlineDownload } from 'react-icons/ai'
import { File } from '../../interfaces/user.interface'
import { useAppDispatch, useTypedSelector } from '../../hooks/redux'

const image = ['.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp']
const video = ['.mpeg', '.mp4', '.ogg', '.webm']
const audio = ['.mp3', '.wav', '.aiff', '.au', '.raw', '.wv']
const pdf = '.pdf'

export const AttachmentByFileType: FC = () => {

    const previewFile = useTypedSelector(state => state.appInfo.previewFile)
    
  return (
    <>
        {image.includes(previewFile!.type) && <img src={`${process.env.REACT_APP_STATIC_URL}/${previewFile!.path}`} className='rounded-[4px_4px_0px_0px] object-contain max-h-full min-w-full h-auto'/>}
        {video.includes(previewFile!.type) && <video src={`${process.env.REACT_APP_STATIC_URL}/${previewFile!.path}`} controls className='object-contain max-h-full min-w-full h-auto'></video>}
        {audio.includes(previewFile!.type) && <audio src={`${process.env.REACT_APP_STATIC_URL}/${previewFile!.path}`} controls></audio>}
        {pdf === previewFile!.type && 
            <embed src={`${process.env.REACT_APP_STATIC_URL}/${previewFile!.path}`} type='application/pdf' className='object-contain min-h-[110%] min-w-full'/>
        }
        {!image.includes(previewFile!.type) && !video.includes(previewFile!.type) && !audio.includes(previewFile!.type) && pdf !== previewFile!.type &&
            <div className='text-white flex flex-col gap-4 items-center justify-center bg-black/90 shadow w-[350px] h-[150px] rounded-xl'>
                <p>Preview is not available</p>
                <a 
                    href={`${process.env.REACT_APP_STATIC_URL}/files/downloadFile/${previewFile!._id}`} 
                    download 
                    className='flex items-center gap-3 bg-[#1890FF] p-2 rounded'
                >
                    <AiOutlineDownload/>
                    <p>Download</p>
                </a>
            </div>
        }
    </>
  )
}
