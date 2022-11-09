import {Tokens} from '../interfaces/token.interface'
export interface IUser{
    _id: string
    firstName: string
    lastName: string
    email: string
    password: string
    availableSpace: number
    usedSpace: number
}

export interface UserCreationAttr{
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

export interface UserData {
    user: IUser
    accessToken: string
    refreshToken: string
}