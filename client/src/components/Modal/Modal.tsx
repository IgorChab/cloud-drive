import React, { FC, useState } from 'react'
import { isReturnStatement } from 'typescript'
import {closeModal} from '../../features/events/eventSlice'
import { useAppDispatch, useTypedSelector } from '../../hooks/redux'
import './Modal.css'


const Modal: FC = () => {

    const modal = useTypedSelector(state => state.event.modal)

    const dispatch = useAppDispatch()

    const [folderName, setFolderName] = useState('')

    const createFolder = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.code == 'Enter' && folderName.trim().length != 0){
            console.log('created folder name', folderName)
            dispatch(closeModal())
        } else {
            return
        }
    }
  return (
    <div className='backdrop' onClick={() => dispatch(closeModal())}>
        <div className="modalContent" onClick={e => e.stopPropagation()}>
            <p className="modalTitle">{modal.type == 'rename'? 'Rename folder' : 'Folder Name'}</p>
            <input 
                type="text" 
                placeholder={modal.type == 'rename'? 'New name' : 'New Folder' }
                className='modalInput'
                onChange={e => setFolderName(e.target.value)}
                onKeyDown={(e) => {createFolder(e)}}
            />
        </div>
    </div>
  )
}

export default Modal