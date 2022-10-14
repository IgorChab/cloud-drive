import {configureStore, combineReducers} from "@reduxjs/toolkit";
import {authApi} from "./services/auth";
import AuthReducer from '../features/auth/authSlice'
import EventReducer from '../features/events/eventSlice'

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        auth: AuthReducer,
        event: EventReducer
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(authApi.middleware),
    devTools: true
})



export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch