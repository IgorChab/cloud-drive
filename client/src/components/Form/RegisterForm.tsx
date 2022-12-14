import React, {FC, useEffect, useState} from 'react';
import './Form.css'
import {MdErrorOutline} from 'react-icons/md'
import {TextField, Button, Paper, Snackbar, Slide, SlideProps, makeStyles, SnackbarContent} from '@material-ui/core'
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../app/services/authService'
import {useTypedSelector, useAppDispatch} from '../../hooks/redux'
import {setLoading} from '../../features/user/userSlice'

type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionUp(props: TransitionProps) {
  return <Slide {...props} direction="up"/>;
}

const RegisterForm: FC = () => {

    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [inNameInput, setInNameInput] = useState(false)
    const [inSurnameInput, setInSurnameInput] = useState(false)
    const [inEmailInput, setInEmailInput] = useState(false)
    const [inPasswordInput, setInPasswordInput] = useState(false)

    const [nameError, setNameError] = useState('')
    const [surnameError, setSurnameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')

    const [validForm, setValidForm] = useState(false)

    const [open, setOpen] = useState(false)

    const [serverError, setServerError] = useState('')

    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    const isLoading = useTypedSelector(state => state.appInfo.isLoading)

    useEffect(() => {
        if(name.trim().length == 0){
            setNameError('Name connot be empty')
        } else {
            setNameError('')
        }

        if(surname.trim().length == 0){
            setSurnameError('Surname connot be empty')
        } else {
            setSurnameError('')
        }

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

        if(!nameError && !surnameError && !emailError && !passwordError){
            setValidForm(true)
        } else {
            setValidForm(false)
        }
    },[name, surname, email, password, nameError, surnameError, emailError, passwordError])

    const registration = async () => {
        if(!validForm){
            return
        } else {
            AuthService.register({
                firstName: name,
                lastName: surname,
                email: email,
                password: password 
            })
            .then(() => navigate('/login'))
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
                    <p className='formTitle'>Registration</p>
                    <TextField
                        label="Name"
                        variant="outlined"
                        size='small'
                        onChange={(e) => {setName(e.target.value); setInNameInput(true)}}
                        error={inNameInput && !!nameError}
                        helperText={inNameInput && nameError}
                    />
                    <TextField
                        label="Surname"
                        variant="outlined"
                        size='small'
                        onChange={(e) => {setSurname(e.target.value); setInSurnameInput(true)}}
                        error={inSurnameInput && !!surnameError}
                        helperText={inSurnameInput && surnameError}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        size='small'
                        onChange={(e) => {setEmail(e.target.value); setInEmailInput(true)}}
                        error={inEmailInput && !!emailError}
                        //@ts-ignore
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
                        onClick={registration}
                        disabled={!validForm}
                    >
                       {isLoading? 'Loading...' : 'Sign Up'}
                    </Button>
                    <div className='wrapLink'>
                        <p>Already registered?</p>
                        <Link to={'/login'} className='text-[#43A5FF] hover:underline'>Login</Link>
                    </div>
                </form>
            </Paper>
            <Snackbar
                open={open}
                message={serverError}
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


export default RegisterForm;