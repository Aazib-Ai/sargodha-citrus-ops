import { getTransactions } from '@/lib/services/transactions'
import { TransactionList } from '@/components/transactions/transaction-list'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function TransactionsPage() {
    const transactions = await getTransactions()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Transactions</h1>
                <Button asChild>
                    <Link href="/transactions/new">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New
                    </Link>
                </Button>
            </div>

            {/* TODO: Add Filters Component Here */}

            <TransactionList transactions={transactions} />
        </div>
    )
}
