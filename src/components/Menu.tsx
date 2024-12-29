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
        <div className="flex gap-1 bg-neutral-950 backdrop-blur-xl rounded-lg px-4 py-3 mb-4">
            <MenuItem title="Board" icon={<BookmarkCheckIcon className="w-5 h-5" />} href="/dashboard" />
            <MenuItem title="Files" icon={<FileIcon className="w-5 h-5" />} href="/dashboard/files" />
            <MenuItem title="Settings" icon={<SettingsIcon className="w-5 h-5" />} href="/settings" />
            <Button 
                variant="ghost" 
                className="gap-3 ml-auto h-7 text-red-500 hover:text-red-400 hover:bg-red-500/10" 
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
        <Button variant={pathname === href ? 'secondary' : 'ghost'} className={cn("justify-start gap-3 px-4 py-2 h-7 rounded-md", className)} asChild>
            <Link href={href}>
                {icon}
                {title}
            </Link>
        </Button>
    )
}

export default Menu