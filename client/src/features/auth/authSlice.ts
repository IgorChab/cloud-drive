import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import { User } from '../../app/services/auth'
import {RootState} from "../../app/store";

interface AuthState {
    user: User | null
    accessToken: string | null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        accessToken: null
    } as AuthState,
    reducers: {
        setCredentials: (state, {payload: {user, accessToken}}:PayloadAction<{user: User, accessToken: string}>) => {
            state.user = user
            state.accessToken = accessToken
        },
        logout: (state) => {
            state.user = null
            state.accessToken = null
        }
    }
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer