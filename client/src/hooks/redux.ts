import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch, } from "../app/store";
import { TypedUseSelectorHook } from 'react-redux'

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch: () => AppDispatch = useDispatch