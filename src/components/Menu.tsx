'use client'

import Link from "next/link"
import { Button } from "./ui/button"
import { BookmarkCheckIcon, SearchIcon, FileIcon, SettingsIcon, LogOutIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const Menu = () => {
    return (
        <div className="flex flex-col gap-1 h-full bg-neutral-950 backdrop-blur-xl rounded-xl p-4 sticky top-4">
            <div className="mb-8 mt-4">
                <h2 className="font-semibold text-xl text-neutral-100">Dashboard</h2>
                <p className="text-sm text-neutral-400">Manage your offers</p>
            </div>
            <MenuItem title="Board" icon={<BookmarkCheckIcon className="w-5 h-5" />} href="/dashboard" />
            <MenuItem title="Offers" icon={<SearchIcon className="w-5 h-5" />} href="/offers" />
            <MenuItem title="Files" icon={<FileIcon className="w-5 h-5" />} href="/files" />
            <MenuItem title="Settings" icon={<SettingsIcon className="w-5 h-5" />} href="/settings" />
            <MenuItem className="mt-auto" title="Logout" icon={<LogOutIcon className="w-5 h-5" />} href="/logout" />
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