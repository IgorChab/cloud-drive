import React, { useEffect } from 'react';
import Dashboard from "./components/Dashboard/Dashboard";
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import RegisterForm from './components/Form/RegisterForm'; 
import LoginForm from './components/Form/LoginForm';
import { useTypedSelector, useAppDispatch } from './hooks/redux';
import NotFound from './components/404/NotFound';
import {useCheckAuthQuery} from './app/services/auth'
import { setCredentials, logout } from './features/user/userSlice';
import { setStorageInfo } from './features/files/fileSlice';

function App() {

    const user = useTypedSelector(state => state.auth.user)
    console.log(user)
    const dispatch = useAppDispatch()

    const {data, isLoading, error} = useCheckAuthQuery()

    useEffect(() => {
        //@ts-ignore
        if(data){
            dispatch(setCredentials(data))
            dispatch(setStorageInfo({
                currentFolder: data.user._id, 
                files: data.user.files,
            }))
        } else {
            dispatch(logout())
        }
    }, [data])

  return (
        <BrowserRouter>
            <Routes>
                {/* <Route  path='/' element={<Dashboard/>}/>
                <Route path='/login' element={<LoginForm/>}/>
                <Route path='/dashboard' element={<Dashboard/>}/> */}
                {user && <Route path='/dashboard' element={<Dashboard/>}/>}
                {!user && <Route path='/login' element={<LoginForm/>}/>}
                {!user && <Route path='/' element={<RegisterForm/>}/>}
                <Route path='*' element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
  );
}

export default App;
