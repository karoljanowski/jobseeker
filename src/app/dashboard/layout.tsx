import Menu from "@/components/Menu"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-screen bg-neutral-900 text-white">
            <div className="max-w-[1920px] h-full flex flex-col mx-auto p-4">
                <Menu />
                <main className="px-2 h-full">
                    {children}
                </main>
            </div>
        </div>
    )
}   