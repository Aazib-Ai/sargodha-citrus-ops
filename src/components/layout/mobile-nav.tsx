'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, List, PieChart, ShoppingBag, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Ledger', href: '/ledger', icon: PieChart },
    { name: 'Transactions', href: '/transactions', icon: List },
    { name: 'Orders', href: '/orders', icon: ShoppingBag },
    { name: 'Journal', href: '/journal', icon: BookOpen },
]

export function MobileNav() {
    const pathname = usePathname()

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background pb-safe-area-inset-bottom">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center flex-1 h-full gap-1 text-xs font-medium transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-primary"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
