import { MobileNav } from '@/components/layout/mobile-nav'
import { QuickAddFAB } from '@/components/layout/quick-add-fab'
import { Sidebar } from '@/components/layout/sidebar'
import { Toaster } from '@/components/ui/toaster'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 pb-16 md:pb-0">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 flex-shrink-0 border-r bg-background">
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="container mx-auto p-4 md:p-8 max-w-5xl">
                    {children}
                </div>
            </main>

            {/* Mobile Navigation */}
            <div className="md:hidden">
                <MobileNav />
                <QuickAddFAB />
            </div>

            <Toaster />
        </div>
    )
}
