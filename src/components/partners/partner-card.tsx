import { Partner } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Wallet, PieChart, TrendingDown } from 'lucide-react'

interface PartnerCardProps {
    partner: Partner
}

export function PartnerCard({ partner }: PartnerCardProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold flex justify-between items-center">
                    <span>{partner.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">{partner.email}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Pool Share</span>
                        <span className="font-bold">{partner.contributionPercentage?.toFixed(1)}%</span>
                    </div>
                    <Progress value={partner.contributionPercentage} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Wallet className="w-3 h-3" />
                            Total Contribution
                        </div>
                        <div className="text-xl font-bold text-green-600">
                            {partner.totalContribution?.toLocaleString()} PKR
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <TrendingDown className="w-3 h-3" />
                            Expenses Paid
                        </div>
                        <div className="text-xl font-bold text-red-600">
                            {partner.totalExpenses?.toLocaleString()} PKR
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
