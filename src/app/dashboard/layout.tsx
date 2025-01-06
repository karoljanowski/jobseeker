import Menu from "@/components/Menu"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen">
            <div className="max-w-[1920px] grid grid-rows-[1fr_auto] mx-auto p-4">
                <Menu />
                <main className="px-2">
                    {children}
                </main>
            </div>
        </div>
    )
}   