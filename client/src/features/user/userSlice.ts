import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {User, File} from '../../interfaces/user.interface'
import {RootState} from "../../app/store";

interface UserState {
    user: User | null
    accessToken: string | null
    currentFolder: string
}

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        accessToken: null,
        currentFolder: ''
    } as UserState,
    reducers: {
        setCredentials: (state, {payload: {user, accessToken}}:PayloadAction<{user: User, accessToken: string}>) => {
            state.user = user
            state.accessToken = accessToken
            state.currentFolder = user._id
        },
        setFiles: (state, {payload: files}: PayloadAction<File[]>) => {
            state.user!.files = files
        },
        logout: (state) => {
            state.user = null
            state.accessToken = null
        },
    }
})

export const { setCredentials, logout, setFiles} = userSlice.actions
export default userSlice.reducer