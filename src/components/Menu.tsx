'use client'

import Link from "next/link"
import { Button } from "./ui/button"
import { BookmarkCheckIcon, FileIcon, LogOutIcon, BarChartIcon, MenuIcon, LucideBriefcaseBusiness } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { logout } from "@/lib/actions/auth"
import { toast } from "react-hot-toast"
import { Sheet, SheetHeader, SheetContent, SheetTrigger, SheetTitle } from "./ui/sheet"
import { useState } from "react"

const Menu = () => {
    const router = useRouter()
    const pathname = usePathname()

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
    ]

    return (
        <div className="flex gap-1 bg-gray-950/40 backdrop-blur-xl rounded-lg px-4 py-3 mb-4">
            <div className="hidden md:flex gap-1">
                {menuItems.map((item) => (
                    <Button key={item.title} variant="ghost" size="sm" className={cn("justify-start gap-3", pathname === item.href ? 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/10' : 'text-gray-400 hover:text-gray-300 hover:bg-gray-500/10')} asChild>
                        <Link href={item.href}>
                            {item.icon}
                            {item.title}
                        </Link>
                    </Button>
                ))}
            </div>
            <MobileMenu menuItems={menuItems} />
            <Button 
                variant="ghost" 
                className="gap-3 ml-auto h-7 text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10" 
                onClick={handleLogout}
            >
                <LogOutIcon className="w-5 h-5" />
                Logout
            </Button>
        </div>
    )
}

const MobileMenu = ({ menuItems }: { menuItems: { title: string, icon: React.ReactNode, href: string }[] }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" className="gap-3 justify-start text-gray-200 hover:text-gray-100 hover:bg-gray-500/10 h-7">
                        <MenuIcon className="w-5 h-5" /> Menu
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
                        </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default Menu