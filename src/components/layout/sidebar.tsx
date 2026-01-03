'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, List, PieChart, ShoppingBag, BookOpen, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/supabase/auth'
import { useRouter } from 'next/navigation'

const navItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Ledger', href: '/ledger', icon: PieChart },
    { name: 'Transactions', href: '/transactions', icon: List },
    { name: 'Orders', href: '/orders', icon: ShoppingBag },
    { name: 'Journal', href: '/journal', icon: BookOpen },
]

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut()
        router.push('/login')
    }

    return (
        <div className="flex flex-col h-full bg-background border-r">
            <div className="p-6">
                <h1 className="text-xl font-bold">Citrus Ops</h1>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-destructive"
                    onClick={handleSignOut}
                >
                    <LogOut className="w-5 h-5 mr-2" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}
