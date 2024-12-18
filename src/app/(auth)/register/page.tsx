'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { register } from "@/lib/actions/auth"
import Link from "next/link"
import LabelInput from "@/components/ui/labelInput"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
    const [state, formAction, pending] = useActionState(register, { success: false, errors: null })
    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            router.push('/login')
            toast.success('Registration successful! Please login.')
        }else if (state.errors) {
            toast.error('Check form for errors and try again')
        }
    }, [state])

    return (
        <Card className="w-[400px] bg-neutral-950 border-neutral-800">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Register</CardTitle>
                <CardDescription>Create a new account</CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <LabelInput name="email" label="Email" placeholder="name@example.com" type="email" required errors={state.errors?.email} />
                    <LabelInput name="password" label="Password" placeholder="********" type="password" required errors={state.errors?.password} />
                    <LabelInput name="confirmPassword" label="Confirm Password" placeholder="********" type="password" required errors={state.errors?.confirmPassword} />
                    <Button type="submit" className="w-full" disabled={pending} variant="secondary">
                        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Register'}
                    </Button>
                    <p className="text-sm text-center text-neutral-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-neutral-200 hover:underline">
                            Login
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    )
}
