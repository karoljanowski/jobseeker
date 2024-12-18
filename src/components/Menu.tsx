'use client'

import Link from "next/link"
import { Button } from "./ui/button"
import { BookmarkCheckIcon, SearchIcon, FileIcon, SettingsIcon, LogOutIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { logout } from "@/lib/actions/auth"
import { toast } from "react-hot-toast"

const Menu = () => {
    const router = useRouter()

    const handleLogout = async () => {
        const response = await logout()
        if (response.success) {
            router.push('/login')
            toast.success('Logged out successfully')
        }
    }

    return (
        <div className="flex flex-col gap-1 h-full bg-neutral-950 backdrop-blur-xl rounded-xl p-4 sticky top-4">
            <div className="mb-8 mt-4">
                <h2 className="font-semibold text-xl text-neutral-100">Dashboard</h2>
                <p className="text-sm text-neutral-400">Manage your offers</p>
            </div>
            <MenuItem title="Board" icon={<BookmarkCheckIcon className="w-5 h-5" />} href="/dashboard" />
            <MenuItem title="Files" icon={<FileIcon className="w-5 h-5" />} href="/dashboard/files" />
            <MenuItem title="Settings" icon={<SettingsIcon className="w-5 h-5" />} href="/settings" />
            <Button 
                variant="destructive" 
                className="mt-auto gap-3" 
                onClick={handleLogout}
            >
                <LogOutIcon className="w-5 h-5" />
                Logout
            </Button>
        </div>
    )
}

interface MenuItemProps {
    title: string
    icon: React.ReactNode
    href: string
    className?: string
}

const MenuItem = ({ title, icon, href, className }: MenuItemProps) => {
    const pathname = usePathname()
    return (
        <Button variant={pathname === href ? 'secondary' : 'ghost'} className={cn("justify-start gap-3 px-4 rounded-md", className)} asChild>
            <Link href={href}>
                {icon}
                {title}
            </Link>
        </Button>
    )
}

export default Menu