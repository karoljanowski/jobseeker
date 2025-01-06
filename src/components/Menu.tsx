'use client'

import Link from "next/link"
import { Button } from "./ui/button"
import { BookmarkCheckIcon, FileIcon, SettingsIcon, LogOutIcon, BarChartIcon } from "lucide-react"
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
        <div className="flex gap-1 bg-gray-950/40 backdrop-blur-xl rounded-lg px-4 py-3 mb-4">
            <MenuItem title="Board" icon={<BookmarkCheckIcon className="w-5 h-5" />} href="/dashboard" />
            <MenuItem title="Stats" icon={<BarChartIcon className="w-5 h-5" />} href="/dashboard/stats" />
            <MenuItem title="Files" icon={<FileIcon className="w-5 h-5" />} href="/dashboard/files" />
            <MenuItem title="Settings" icon={<SettingsIcon className="w-5 h-5" />} href="/dashboard/settings" />
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
        <Button variant='ghost' size="sm" className={cn("justify-start gap-3", pathname === href ? 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/10' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-500/10', className)} asChild>
            <Link href={href}>
                {icon}
                {title}
            </Link>
        </Button>
    )
}

export default Menu