export type LoginState = {
    success: boolean
    errors: {
        email?: string[]
        password?: string[]
        credentials?: string
    } | null
}

export type RegisterState = {
    success: boolean
    errors: {
        email?: string[]
        password?: string[]
        confirmPassword?: string[]
    } | null
}