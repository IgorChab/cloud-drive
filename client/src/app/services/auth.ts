import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
  } from '@reduxjs/toolkit/query'

import { setCredentials, logout } from '../../features/auth/authSlice';
import {RootState} from "../store";

export interface User {
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface UserRes {
    user: User
    accessToken: string
}

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
    baseUrl: 'http://localhost:5000/auth',
    credentials: 'same-origin',
    prepareHeaders: (headers, { getState }) => {
        // By default, if we have a token in the store, let's use that for authenticated requests
        const token = (getState() as RootState).auth.accessToken
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        return headers
    },
})

const baseQueryWithReauth: BaseQueryFn<FetchArgs | string, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions)
    console.log(result)
    console.log('args ==>', args)
    console.log('api ==>', api)
    console.log('extraOptions ==>', extraOptions)
    if (result?.error?.status === 401) {
        console.log('sending refresh token')
        // send refresh token to get new access token 
        const refreshResult = await baseQuery('/refresh', api, extraOptions)
        console.log(refreshResult)
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
                url: '/register',
                method: 'post',
                body: userData
            })
        }),
        login: build.mutation<UserRes, loginReq>({
            query: (userData) => ({
                url: '/login',
                method: 'POST',
                body: userData
            })
        }),
        getUsers: build.query({
            query: () => ({
                url: '/users',
                method: 'GET'
            })
        })
    })
})

export const { useRegisterMutation, useLoginMutation, useGetUsersQuery } = authApi