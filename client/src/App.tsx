import React, { useEffect } from 'react';
import Dashboard from "./components/Dashboard/Dashboard";
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
import RegisterForm from './components/Form/RegisterForm'; 
import LoginForm from './components/Form/LoginForm';
import { useTypedSelector, useAppDispatch } from './hooks/redux';
import NotFound from './components/404/NotFound';
import AuthService from './app/services/authService'
import {ShareFile} from './components/ShareFile/ShareFile'
function App() {

    const isAuth = useTypedSelector(state => state.appInfo.isAuth)
    const appInfo = useTypedSelector(state => state.appInfo)
    // console.log('render')

    useEffect(() => {
        AuthService.checkAuth()
    }, [])

  return (
        <BrowserRouter>
            <Routes>
                {isAuth
                    ?
                        <>
                            <Route path='/dashboard' element={<Dashboard/>}/>
                            <Route path='*' element={<Navigate to={'/dashboard'}/>}/>
                        </>
                    :
                        <>
                            <Route path='/login' element={<LoginForm/>}/>
                            <Route path='/' element={<RegisterForm/>}/>
                            <Route path='/dashboard' element={<Navigate to={'/'}/>}/>
                        </>
                }
                <Route path='/shareFiles/:link' element={<ShareFile/>}/>
            </Routes>
        </BrowserRouter>
  );
}

export default App;
