import { JournalEntry } from '@/types'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { format } from 'date-fns'
import Image from 'next/image'

interface JournalTimelineProps {
    entries: (JournalEntry & { partnerName: string })[]
}

export function JournalTimeline({ entries }: JournalTimelineProps) {
    if (entries.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                No journal entries yet.
            </div>
        )
    }

    return (
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted-foreground/20 before:to-transparent">
            {entries.map((entry) => (
                <div key={entry.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                    {/* Icon */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 dark:bg-slate-800 dark:border-slate-900">
                        <Avatar className="w-full h-full">
                            <AvatarFallback>{entry.partnerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Content */}
                    <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 shadow-sm">
                        <CardHeader className="p-0 mb-2 flex flex-row justify-between items-center space-y-0">
                            <span className="font-bold text-sm">{entry.partnerName}</span>
                            <time className="text-xs text-muted-foreground">
                                {entry.created_at && format(new Date(entry.created_at), 'MMM d, h:mm a')}
                            </time>
                        </CardHeader>
                        <CardContent className="p-0 space-y-3">
                            {entry.content && (
                                <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                                    {entry.content}
                                </p>
                            )}

                            {entry.image_urls && entry.image_urls.length > 0 && (
                                <div className="grid grid-cols-2 gap-2">
                                    {entry.image_urls.map((url, i) => (
                                        <div key={i} className="relative aspect-video rounded-md overflow-hidden bg-muted">
                                            <Image
                                                src={url}
                                                alt="Journal attachment"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    )
}
