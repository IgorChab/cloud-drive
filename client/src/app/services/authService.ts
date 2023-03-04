import $axios from "../http";
import axios, {AxiosResponse} from "axios";
import { store } from "../store";
import {UserRes} from '../../interfaces/user.interface'
import {setCredentials, setLoading, logout} from '../../features/user/userSlice'

interface registerReq {
    firstName: string
    lastName: string
    email: string
    password: string
}

interface loginReq {
    email: string
    password: string
}

class AuthServise {
    static async register(registerData: registerReq){
        store.dispatch(setLoading(true))
        const response = await $axios.post<void>('auth/register', registerData)
        return response
    }

    static async login(loginData: loginReq): Promise<UserRes>{
        store.dispatch(setLoading(true))
        const response = await $axios.post<UserRes>('auth/login', loginData)
        if(response){
            store.dispatch(setCredentials(response.data))
            localStorage.setItem('token', response.data.accessToken)
        }
        return response.data
    }

    static logout(id: string){
        $axios.get(`/auth/logout/${id}`)
    }

    static async checkAuth(){
        try{
            const response = await axios.get<UserRes>(`${process.env.REACT_APP_SERVER_URL}/auth/refresh`, {withCredentials: true})
            localStorage.setItem('token', response.data.accessToken);
            store.dispatch(setCredentials(response.data))
        } catch(e) {
            store.dispatch(logout())
        }
    }
}

export default AuthServise
