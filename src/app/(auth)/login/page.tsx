'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LabelInput from "@/components/ui/labelInput"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { login } from "@/lib/actions/auth"
import Link from "next/link"
import { useActionState } from "react"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
    const [state, formAction, pending] = useActionState(login, { success: false, errors: null })
    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            router.push('/dashboard')
            toast.success('Logged in successfully')
        }else if (state.errors?.credentials) {
            toast.error(state.errors.credentials)
        }
    }, [state])

    return (
        <Card className="w-[400px] bg-gray-950 border-gray-800">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Login</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <LabelInput name="email" label="Email" placeholder="name@example.com" type="email" required errors={state.errors?.email} />
                    <LabelInput name="password" label="Password" placeholder="********" type="password" required errors={state.errors?.password} />

                    <Button type="submit" className="w-full" disabled={pending} variant="secondary">
                        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Login'}
                    </Button>
                    <p className="text-sm text-center text-gray-500">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-gray-200 hover:underline">
                            Register
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    )
}
