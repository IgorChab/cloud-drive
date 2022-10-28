import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
  } from '@reduxjs/toolkit/query'

import { setCredentials, logout } from '../../features/user/userSlice';
import {RootState} from "../store";
import {User, UserRes} from '../../interfaces/user.interface'

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

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:5000/',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        // By default, if we have a token in the store, let's use that for authenticated requests
        const token = (getState() as RootState).appInfo.accessToken
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        return headers
    },
})

export const baseQueryWithReauth: BaseQueryFn<FetchArgs | string, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
    if (result?.error?.status === 401) {
        console.log('sending refresh token')
        // send refresh token to get new access token 
        const refreshResult = await baseQuery('auth/refresh', api, extraOptions)
        if (refreshResult?.data) {
            // store the new token 
            //@ts-ignore
            api.dispatch(setCredentials(refreshResult?.data))
            // retry the original query with new access token 
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logout())
        }
    }

    return result
}

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQueryWithReauth,
    endpoints: build => ({
        register: build.mutation<void, registerReq>({
            query: (userData) => ({
                url: 'auth/register',
                method: 'post',
                body: userData
            })
        }),
        login: build.mutation<UserRes, loginReq>({
            query: (userData) => ({
                url: 'auth/login',
                method: 'POST',
                body: userData
            })
        }),
        checkAuth: build.query<UserRes, void>({
            query: () => ({
                url: 'auth/refresh',
                method: 'get'
            })
        })
    })
})

export const { useRegisterMutation, useLoginMutation, useCheckAuthQuery } = authApi