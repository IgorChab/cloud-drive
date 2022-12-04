import React, { FC, useEffect, useState } from 'react'
import {closeModal} from '../../features/events/eventSlice'
import { useAppDispatch, useTypedSelector } from '../../hooks/redux'
import FileService from '../../app/services/fileService';
// import { setFiles } from '../../features/user/userSlice';
import {Paper, TextField, Button} from '@material-ui/core'

const Modal: FC = () => {

    const currentFile = useTypedSelector(state => state.event.currentFile)

    const currentFolder = useTypedSelector(state => state.appInfo.currentFolder)

    const modal = useTypedSelector(state => state.event.modal)

    const currentPath = useTypedSelector(state => state.appInfo.currentPath)

    const userID = useTypedSelector(state => state.appInfo.user!._id)

    const dispatch = useAppDispatch()

    const [error, setError] = useState('')

    const [fileName, setFileName] = useState<string>(modal.type == 'rename'? currentFile?.name : '')
    const [fileNameError, setFileNameError] = useState('')

    const createFolder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(fileName.trim().length == 0){
            setFileNameError('Enter folder name')
            setError('')
            return
        }
        if(modal.type == 'rename'){
            FileService.renameFile({
                fileID: currentFile._id,
                newName: fileName
            })
            .then(() => dispatch(closeModal()))
            .catch(e => setError(e?.response?.data?.message))
        } else {
            FileService.createFolder({
                folderName: fileName,
                currentFolder: currentPath,
                parentFolderId: currentFolder?._id || userID
            })
            .then(() => dispatch(closeModal()))
            .catch(e => setError(e?.response?.data?.message))
        }
    }

    const handleCloseModal = () => {
        dispatch(closeModal())
    }

  return (
    <form className='absolute inset-0 bg-black/[54%] flex items-center justify-center z-50' 
        onClick={handleCloseModal} 
        onSubmitCapture={createFolder}
    >
        <Paper className='w-[350px] p-4 rounded' onClick={e => e.stopPropagation()}>
            <p className="font-medium">{modal.type == 'rename'? 'Rename' : 'Folder Name'}</p>
            <TextField 
                autoFocus
                type="text" 
                placeholder={modal.type == 'rename'? 'New name' : 'New Folder' }
                fullWidth
                onChange={e => {setFileName(e.target.value); setFileNameError('')}}
                error={!!error || !!fileNameError}
                value={fileName}
                helperText={error || fileNameError}
            />
            <div className='mt-3 flex gap-3 justify-end'>
                <Button variant='outlined' color='secondary' size='small' onClick={handleCloseModal} >
                    Cancel
                </Button>
                <Button variant='outlined' color='primary' size='small' type='submit'>
                    {modal.type == 'rename'? 'Rename' : 'Create'}
                </Button>
            </div>
        </Paper>
    </form>
  )
}

export default Modal