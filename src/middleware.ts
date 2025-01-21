import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { decrypt } from "./lib/auth/session"

export default async function middleware(req: NextRequest) {
    const protectedRoutes = ['/dashboard']
    const currentPath = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(currentPath)

    if (isProtectedRoute) {
        const cookieStore = await cookies()
        const cookie = cookieStore.get('session')?.value
        const session = await decrypt(cookie)

        if (!session?.userId) {
            return NextResponse.redirect(new URL('/login', req.nextUrl))
        }
    }

    return NextResponse.next()
}
