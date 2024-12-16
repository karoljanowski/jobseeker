import Menu from "@/components/Menu"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-[1920px] mx-auto">
                <div className="grid grid-cols-[280px_1fr] gap-6 min-h-screen p-4"> 
                    <Menu />
                    <main className="py-4">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}   