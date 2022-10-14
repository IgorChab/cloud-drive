import React, { useEffect } from 'react';
import Dashboard from "./components/Dashboard/Dashboard";
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import RegisterForm from './components/Form/RegisterForm'; 
import LoginForm from './components/Form/LoginForm';
import { useTypedSelector } from './hooks/redux';
import NotFound from './components/404/NotFound';

function App() {

    const user = useTypedSelector(state => state.auth.user)
    console.log(user)

  return (
        <BrowserRouter>
            <Routes>
                <Route path='/dashboard' element={<Dashboard/>}/>
                {/* {user && <Route path='/dashboard' element={<Dashboard/>}/>}
                {!user && <Route path='/login' element={<LoginForm/>}/>}
                {!user && <Route path='/' element={<RegisterForm/>}/>}
                <Route path='*' element={<NotFound/>}/> */}
            </Routes>
        </BrowserRouter>
  );
}

export default App;
