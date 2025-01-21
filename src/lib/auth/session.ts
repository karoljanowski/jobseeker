import 'server-only'
import { jwtVerify, SignJWT } from "jose"
import { cookies } from 'next/headers';
import { redirect } from "next/navigation"

type SessionPayload = {
    userId: number
    expires: Date
}

const key = new TextEncoder().encode(process.env.JWT_SECRET_KEY)

const cookieOptions = {
    name: 'session',
    options: {
        httpOnly: true,
        secure: true,
        path: '/',
        sameSite: 'lax' as const,
    },
    duration: 24 * 60 * 60 * 1000,
}

export const encrypt = async (payload: SessionPayload) => {
    return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1day')
    .sign(key)
}

export const decrypt = async (session: string | undefined = '') => {
    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ['HS256'],
        })
        return payload
    } catch {
        return null
    }
}

export const createSession = async (userId: number) => {
    const expires = new Date(Date.now() + cookieOptions.duration)
    const session = await encrypt({ userId, expires })

    const cookieStore = await cookies()
    cookieStore.set(cookieOptions.name, session, cookieOptions.options)
}

export const verifySession = async () => {
    const cookieStore = await cookies()
    const cookie = cookieStore.get(cookieOptions.name)?.value
    const session = await decrypt(cookie)

    if (!session || !session?.userId) {
        redirect('/login')
    }

    return { isAuth: true, userId: Number(session.userId) }
}

export const deleteSession = async () => {
    const cookieStore = await cookies()
    cookieStore.delete(cookieOptions.name)
    redirect('/login')
}
