export type LoginState = {
    errors: {
        email?: string[]
        password?: string[]
        credentials?: string
    } | null
}

export type RegisterState = {
    errors: {
        email?: string[]
        password?: string[]
        confirmPassword?: string[]
    } | null
}