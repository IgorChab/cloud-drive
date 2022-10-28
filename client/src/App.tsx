import React, { useEffect } from 'react';
import Dashboard from "./components/Dashboard/Dashboard";
import {Routes, Route, BrowserRouter, Navigate} from 'react-router-dom'
import RegisterForm from './components/Form/RegisterForm'; 
import LoginForm from './components/Form/LoginForm';
import { useTypedSelector, useAppDispatch } from './hooks/redux';
import NotFound from './components/404/NotFound';
import {useCheckAuthQuery} from './app/services/auth'
import { setCredentials, logout} from './features/user/userSlice';

function App() {

    const user = useTypedSelector(state => state.appInfo.user)
    console.log(user)
    const dispatch = useAppDispatch()

    const {data, isLoading, error} = useCheckAuthQuery()

    useEffect(() => {
        //@ts-ignore
        if(data){
            dispatch(setCredentials(data))
        } else {
            dispatch(logout())
        }
    }, [data])

  return (
        <BrowserRouter>
            <Routes>
                {user
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
            </Routes>
        </BrowserRouter>
  );
}

export default App;
