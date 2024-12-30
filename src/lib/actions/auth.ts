'use server'

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { SignJWT, decodeJwt, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { LoginState, RegisterState } from "../types/auth"

const TOKEN_EXPIRATION = '7d' // 7 days
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 // 7 days in seconds

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
        return { success: false, errors: {
            email: parsedData.error.flatten().fieldErrors.email,
            password: parsedData.error.flatten().fieldErrors.password,
        } }
    }

    const { email, password } = parsedData.data

    const user = await prisma.user.findUnique({ where: { email } })
    if(!user || !(await bcrypt.compare(password, user.password))) {
        return { success: false, errors: {
            credentials: "Invalid email or password"
        } }
    }

    const token = await new SignJWT({ id: user.id })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(TOKEN_EXPIRATION)
        .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY))

    const cookieStore = await cookies()
    cookieStore.set('token', token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: COOKIE_MAX_AGE
    })

    return { success: true, errors: null }
}

export const logout = async () => {
    const cookieStore = await cookies()
    cookieStore.delete('token')
    return { success: true }
}

const registerSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match"
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
            success: false, 
            errors: {
                email: errors.fieldErrors.email,
                password: errors.fieldErrors.password,
                confirmPassword: errors.fieldErrors.confirmPassword || errors.formErrors
            } 
        }
    }

    const { email, password } = parsedData.data

    try {
        const existingUser = await prisma.user.findUnique({ 
            where: { email } 
        })

        if (existingUser) {
            return {
                success: false,
                errors: {
                    email: ["Email already exists"]
                }
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        await prisma.user.create({
            data: { 
                email, 
                password: hashedPassword 
            }
        })

        return { success: true, errors: null }
    } catch (error) {
        console.error('Registration error:', error)
        return {
            success: false,
            errors: {
                email: ["An error occurred during registration"]
            }
        }
    }
}

export async function getUserId(): Promise<number | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return null;
    }

    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET_KEY)
    );

    const userId = verified.payload.id;

    // Validate that user exists in database
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
      select: { id: true }
    });

    if (!user) {
      return null;
    }

    return user.id;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
}