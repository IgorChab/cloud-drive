import {configureStore, combineReducers} from "@reduxjs/toolkit";
import userReducer from '../features/user/userSlice'
import EventReducer from '../features/events/eventSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer = combineReducers({
    appInfo: userReducer,
    event: EventReducer,
})

const persistConfig = {
    key: 'root',
    storage,
    blacklist: ['event']
  }
   
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false}),
    devTools: true
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch