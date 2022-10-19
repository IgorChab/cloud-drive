import {configureStore, combineReducers} from "@reduxjs/toolkit";
import {authApi} from "./services/auth";
import {fileApi} from "./services/fileService";
import AuthReducer from '../features/user/userSlice'
import EventReducer from '../features/events/eventSlice'
import FileReducer from '../features/files/fileSlice'

const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    auth: AuthReducer,
    event: EventReducer,
    storage: FileReducer,
    [fileApi.reducerPath]: fileApi.reducer
})


export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(authApi.middleware).concat(fileApi.middleware),
    devTools: true,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch