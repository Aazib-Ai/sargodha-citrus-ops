import { getJournalEntries } from '@/lib/services/journal'
import { JournalTimeline } from '@/components/journal/journal-timeline'
import { JournalForm } from '@/components/journal/journal-form'

export const dynamic = 'force-dynamic'

export default async function JournalPage() {
    const entries = await getJournalEntries()

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Operations Journal</h1>

            <JournalForm />
            <JournalTimeline entries={entries} />
        </div>
    )
}
