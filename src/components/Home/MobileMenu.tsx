'use client'

import { useState } from 'react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { LucideBriefcaseBusiness, MenuIcon } from 'lucide-react';
import Link from 'next/link';
const MobileMenu = ({ menuItems }: { menuItems: { label: string; href: string }[] }) => {
    const [open, setOpen] = useState(false);
    return (
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
                    <Button variant="ghost" key={item.href} className="w-full justify-start hover:bg-gray-800/80 hover:text-white p-0">
                        <Link onClick={() => setOpen(false)} className="px-4 py-2" href={item.href}>{item.label}</Link>
                    </Button>
                ))}
                <Button variant="secondary" className="w-full mt-4 p-0">
                    <Link className="px-4 py-2" href="/register">Try for free</Link>
                </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default MobileMenu;