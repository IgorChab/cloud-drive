export interface Tokens {
    accessToken: string
    refreshToken: string
}

export interface TokenPayload {
    userID: string
    tokenHash: string
}