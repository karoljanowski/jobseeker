'use server'

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { LoginState, RegisterState } from "../types/auth"
import { createSession, deleteSession, verifySession } from "./session"
import { cache } from "react"
import { redirect } from "next/navigation"


const loginSchema = z.object({
    email: z.string().refine((email) => email.includes('@'), {
        message: "Invalid email or password",
    }),
    password: z.string().min(1, "Invalid email or password"),
})

export const login = async (state: LoginState, formData: FormData) => {
    const parsedData = loginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    })

    if (!parsedData.success) {
        const errors = parsedData.error.flatten()
        return { errors: {
            email: errors.fieldErrors.email,
            password: errors.fieldErrors.password,
        } }
    }

    const { email, password } = parsedData.data

    try {
        const user = await prisma.user.findUnique({ where: { email } })
        if(!user || !(await bcrypt.compare(password, user.password))) {
            return { errors: {
                credentials: "Invalid email or password"
            }}
        }

        await createSession(user.id)
    } catch {
        return {
            errors: {
                credentials: "An error occurred during login"
            }
        }
    }
    redirect('/dashboard')
}

export const logout = async () => {
    await deleteSession()
}

const registerSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string()
})

export const register = async (state: RegisterState, formData: FormData) => {
    const parsedData = registerSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    })

    if (!parsedData.success) {
        const errors = parsedData.error.flatten()

        return { 
            errors: {
                email: errors.fieldErrors.email,
                password: errors.fieldErrors.password,
                confirmPassword: errors.fieldErrors.confirmPassword
            } 
        }
    }

    const { email, password, confirmPassword } = parsedData.data

    if (password !== confirmPassword) {
        return {
            errors: {
                confirmPassword: ["Passwords do not match"]
            }
        }
    }

    try {
        const existingUser = await prisma.user.findUnique({ 
            where: { email } 
        })

        if (existingUser) {
            return {
                errors: {
                    email: ["Email already exists"]
                }
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: { 
                email, 
                password: hashedPassword 
            }
        })
        await createSession(user.id)
    } catch (error) {
        console.error('Registration error:', error)
        return {
            errors: {
                email: ["An error occurred during registration"],
            }
        }
    }

    redirect('/dashboard')
}

export const getUserId = cache(async () => {
    const session = await verifySession()

    try {   
        const user = await prisma.user.findUnique({ 
            where: { id: session?.userId },
            select: { id: true }
        })   
        return user?.id
    } catch {
        return null
    }
})