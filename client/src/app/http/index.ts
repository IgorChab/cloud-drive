import axios from 'axios'
import {UserRes} from '../../interfaces/user.interface'

const $axios = axios.create({
    baseURL: 'http://localhost:5000/',
    withCredentials: true
})

$axios.interceptors.request.use(config => {
    config.headers!.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})

$axios.interceptors.response.use(config => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.get<UserRes>('http://localhost:5000/auth/refresh', {withCredentials: true})
            localStorage.setItem('token', response.data.accessToken);
            return $axios.request(originalRequest);
        } catch (e) {
            console.log('Not Authorized')
        }
    }
    throw error;
})

export default $axios