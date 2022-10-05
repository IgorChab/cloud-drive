export class CreateUserDto{
    firstName: string
    lastName: string
    email: string
    password: string
}

export class LoginUserDto{
    email: string
    password: string
}
