'use client'

import Link from "next/link"
import { Button } from "./ui/button"
import { BookmarkCheckIcon, FileIcon, SettingsIcon, LogOutIcon, BarChartIcon, MenuIcon, LucideBriefcaseBusiness } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { logout } from "@/lib/actions/auth"
import { toast } from "react-hot-toast"
import { Sheet, SheetHeader, SheetContent, SheetTrigger, SheetTitle } from "./ui/sheet"
import { useState } from "react"

const Menu = () => {
    const router = useRouter()
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const handleLogout = async () => {
        const response = await logout()
        if (response.success) {
            router.push('/login')
            toast.success('Logged out successfully')
        }
    }

    const menuItems = [
        { title: 'Board', icon: <BookmarkCheckIcon className="w-5 h-5" />, href: '/dashboard' },
        { title: 'Stats', icon: <BarChartIcon className="w-5 h-5" />, href: '/dashboard/stats' },
        { title: 'Files', icon: <FileIcon className="w-5 h-5" />, href: '/dashboard/files' },
        { title: 'Settings', icon: <SettingsIcon className="w-5 h-5" />, href: '/dashboard/settings' },
    ]

    return (
        <>
            <div className="gap-1 bg-gray-950/40 backdrop-blur-xl rounded-lg px-4 py-3 mb-4 hidden md:flex">
                    {menuItems.map((item) => (
                    <Button key={item.title} variant="ghost" size="sm" className={cn("justify-start gap-3", pathname === item.href ? 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/10' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-500/10')} asChild>
                        <Link href={item.href}>
                            {item.icon}
                            {item.title}
                        </Link>
                    </Button>
                ))}
                <Button 
                    variant="ghost" 
                    className="gap-3 ml-auto h-7 text-red-500 hover:text-red-400 hover:bg-red-500/10" 
                    onClick={handleLogout}
                >
                    <LogOutIcon className="w-5 h-5" />
                    Logout
                </Button>
            </div>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild className="md:hidden">
                    <Button variant="ghost" size="icon">
                        <MenuIcon className="w-6 h-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-gray-950 border-none border-gray-800 text-white w-[300px]">
                    <SheetHeader className="border-b border-gray-800 pb-4">
                        <SheetTitle className="text-white flex items-center gap-2">
                            <LucideBriefcaseBusiness className="w-6 h-6" /> Jobseeker
                        </SheetTitle>
                    </SheetHeader>
                        <div className="flex flex-col gap-2 mt-6">
                            {menuItems.map((item) => (
                                <Button variant="ghost" key={item.href} className="w-full justify-start hover:bg-gray-800/80 hover:text-white">
                                    <Link onClick={() => setOpen(false)} className="w-full" href={item.href}>{item.title}</Link>
                                </Button>
                            ))}
                            <Button 
                                variant="ghost" 
                                className="gap-3 mt-5 text-red-500 hover:text-red-400 hover:bg-red-500/10" 
                                onClick={handleLogout}
                            >
                                <LogOutIcon className="w-5 h-5" />
                                Logout
                            </Button>
                        </div>
                </SheetContent>
            </Sheet>
        </>
    )
}

export default Menu