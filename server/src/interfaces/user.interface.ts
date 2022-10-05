export interface IUser{
    _id: string
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface UserCreationAttr{
    firstName: string,
    lastName: string,
    email: string,
    password: string
}