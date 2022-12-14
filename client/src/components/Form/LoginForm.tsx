import React, {FC, useEffect, useState} from 'react';
import './Form.css'
import {MdErrorOutline} from 'react-icons/md'
import {TextField, Button, Paper, Slide, SlideProps, Snackbar, SnackbarContent, makeStyles} from '@material-ui/core'
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../../app/services/authService'
import { useTypedSelector, useAppDispatch } from '../../hooks/redux';
import {setLoading} from '../../features/user/userSlice'
type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up"/>;
}

const LoginForm: FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [inEmailInput, setInEmailInput] = useState(false)
    const [inPasswordInput, setInPasswordInput] = useState(false)

    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const [validForm, setValidForm] = useState(false)

    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    const isLoading = useTypedSelector(state => state.appInfo.isLoading)

    const [open, setOpen] = useState(false)

    const [serverError, setServerError] = useState('')

    useEffect(() => {
        const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const validEmail = email.toLowerCase().match(emailRegEx)
        if(!validEmail){
            setEmailError('Invalid email')
        } else {
            setEmailError('')
        }

        const passwordRegEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        const validPassword = password.match(passwordRegEx)
        if(!validPassword){
            setPasswordError('Password must include has at least one number and special character (6 to 16 characters)')
        } else {
            setPasswordError('')
        }

        if(!emailError && !passwordError){
            setValidForm(true)
        } else {
            setValidForm(false)
        }
    },[email, password, emailError, passwordError])

    const authorization = async () => {
        if(!validForm){
            return
        } else {
            AuthService.login({
                email: email,
                password: password 
            })
            .then(() => navigate('/dashboard'))
            .catch(e => {
                setServerError(e?.response?.data?.message)
                setOpen(true)
            })
            .finally(() => dispatch(setLoading(false)))
        }
    }

    const useStyles = makeStyles({
        root: {
            backgroundColor: 'rgb(251, 67, 67)',
            color: '#fff'
        }
    })

    const classes = useStyles()

    return (
        <div className='formContainer'>
            <Paper elevation={10}>
                <form className='form'>
                    <p className='formTitle'>Login</p>
                    <TextField
                        label="Email"
                        variant="outlined"
                        size='small'
                        onChange={(e) => {setEmail(e.target.value); setInEmailInput(true)}}
                        error={inEmailInput && !!emailError}
                        helperText={inEmailInput && emailError}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        size='small'
                        type='password'
                        onChange={(e) => {setPassword(e.target.value); setInPasswordInput(true)}}
                        error={inPasswordInput && !!passwordError}
                        helperText={inPasswordInput && passwordError}
                    />
                    <Button
                        type='button'
                        variant='contained'
                        color='primary'
                        onClick={authorization}
                        disabled={!validForm}
                    >
                        {isLoading? 'Loading...' : 'Login'}
                    </Button>
                    <div className='wrapLink'>
                        <p>Not registered yet?</p>
                        <Link to={'/'} className='text-[#43A5FF] hover:underline'>Registration</Link>
                    </div>
                </form>
            </Paper>
            <Snackbar
                open={open}
                anchorOrigin={{
                    horizontal: 'center',
                    vertical: 'bottom'
                }}
                onClose={() => setOpen(false)}
                autoHideDuration={3000}
                TransitionComponent={TransitionUp}
            >
                <SnackbarContent
                    action={<MdErrorOutline size={30}/>}
                    message={serverError}
                    classes={{root: classes.root}}
                />
            </Snackbar>  
        </div>
    );
};

export default LoginForm;