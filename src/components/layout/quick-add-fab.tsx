'use client'

import { useState } from 'react'
import { Plus, Banknote, ShoppingCart, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function QuickAddFAB() {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()

    return (
        <div className="fixed bottom-20 right-4 z-50 md:hidden">
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        size="icon"
                        className="h-14 w-14 rounded-full shadow-lg"
                    >
                        {isOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Plus className="h-6 w-6" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mb-2 w-48">
                    <DropdownMenuItem onClick={() => router.push('/transactions/new')}>
                        <Banknote className="mr-2 h-4 w-4" />
                        <span>Add Transaction</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/orders/new')}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        <span>New Order</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
