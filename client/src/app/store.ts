import {configureStore, combineReducers} from "@reduxjs/toolkit";
import {authApi} from "./services/auth";
import {fileApi} from "./services/fileService";
import userReducer from '../features/user/userSlice'
import EventReducer from '../features/events/eventSlice'

const rootReducer = combineReducers({
    [authApi.reducerPath]: authApi.reducer,
    appInfo: userReducer,
    event: EventReducer,
    [fileApi.reducerPath]: fileApi.reducer
})


export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false}).concat(authApi.middleware).concat(fileApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch