import Menu from "@/components/Menu"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-neutral-900 text-white">
            <div className="max-w-[1920px] mx-auto p-4">
                <Menu />
                <main className="px-2">
                    {children}
                </main>
            </div>
        </div>
    )
}   