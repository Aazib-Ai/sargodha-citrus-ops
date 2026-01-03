import { Transaction } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'

interface TransactionListProps {
    transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
    if (transactions.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No transactions found.
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {transactions.map((t) => (
                <Card key={t.id} className="overflow-hidden">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <Badge variant={t.category === 'capital_injection' ? 'default' : 'secondary'} className="mb-2">
                                    {t.category.replace('_', ' ')}
                                </Badge>
                                <h3 className="font-semibold text-lg">{t.description}</h3>
                            </div>
                            <span className={t.category === 'capital_injection' ? 'text-green-600 font-bold text-lg' : 'text-red-600 font-bold text-lg'}>
                                {t.category === 'capital_injection' ? '+' : '-'} {t.amount.toLocaleString()} PKR
                            </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-4">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {t.created_at && format(new Date(t.created_at), 'PPP')}
                            </div>
                            <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {/* @ts-ignore */}
                                {t.partnerName}
                            </div>
                            {t.receipt_url && (
                                <div className="flex items-center gap-1 text-blue-600">
                                    <FileText className="w-3 h-3" />
                                    Receipt
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
