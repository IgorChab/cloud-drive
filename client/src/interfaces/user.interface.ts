export interface File {
    _id: string
    name: string
    size: number
    userID: string
    path: string
    date: string
    type: string
    childs: string[]
}

export interface User {
    _id: string
    firstName: string
    lastName: string
    email: string
    password: string
    availableSpace: number
    usedSpace: number
    files: File[]
}

export interface UserRes {
    user: User
    accessToken: string
}