import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string
    icon: LucideIcon
    description?: string
    trend?: 'up' | 'down' | 'neutral'
    trendValue?: string
}

export function StatCard({ title, value, icon: Icon, description, trend, trendValue }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {(description || trendValue) && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {trendValue && (
                            <span className={trend === 'up' ? 'text-green-600 mr-1' : trend === 'down' ? 'text-red-600 mr-1' : ''}>
                                {trendValue}
                            </span>
                        )}
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
