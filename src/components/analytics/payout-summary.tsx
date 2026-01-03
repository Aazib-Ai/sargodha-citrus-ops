import { PartnerPayout } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface PayoutSummaryProps {
    payouts: PartnerPayout[]
}

export function PayoutSummary({ payouts }: PayoutSummaryProps) {
    return (
        <Card className="col-span-full">
            <CardHeader>
                <CardTitle>Partner Payouts (Estimated)</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Partner</TableHead>
                            <TableHead className="text-right">Contribution</TableHead>
                            <TableHead className="text-right">Profit Share</TableHead>
                            <TableHead className="text-right font-bold">Total Payout</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payouts.map((p) => (
                            <TableRow key={p.partnerId}>
                                <TableCell className="font-medium">{p.partnerName}</TableCell>
                                <TableCell className="text-right">{p.contribution.toLocaleString()}</TableCell>
                                <TableCell className="text-right">{Math.round(p.profitShare).toLocaleString()}</TableCell>
                                <TableCell className="text-right font-bold text-green-600">
                                    {Math.round(p.totalPayout).toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
