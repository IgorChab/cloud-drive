import React, { FC } from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useAppDispatch, useTypedSelector } from '../../hooks/redux';
import {closeDialog, openDialog} from '../../features/events/eventSlice'

interface MyDialogProps {
    errorMsg: string
}

export const MyDialog: FC<MyDialogProps> = ({errorMsg}) => {

    const dispatch = useAppDispatch()
    const open = useTypedSelector(state => state.event.dialogOpen)

    const handleClose = () => {
        dispatch(closeDialog())
    };

    return (
        <div className='absolute inset-0 bg-black/[54%] flex items-center justify-center z-50' onClick={handleClose}>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                onClick={e => e.stopPropagation()}
            >
                <DialogTitle id="alert-dialog-title">Upload settings</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {errorMsg}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Disagree
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
