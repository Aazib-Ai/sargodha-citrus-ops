'use server'

import { createClient } from '@/lib/supabase/server'
import { JournalEntry, JournalEntrySchema } from '@/types'
import { revalidatePath } from 'next/cache'

export async function createJournalEntry(data: any) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    const validation = JournalEntrySchema.omit({ id: true, created_at: true }).safeParse({
        ...data,
        partner_id: user.id
    })

    if (!validation.success) {
        return { error: 'Invalid data', details: validation.error.flatten() }
    }

    const { error } = await supabase
        .from('journal_entries')
        .insert(validation.data)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/journal')

    return { success: true }
}

export async function getJournalEntries() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('journal_entries')
        .select(`
            *,
            partners (
                name
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching journal:', error)
        return []
    }

    return data.map(j => ({
        ...j,
        partnerName: j.partners?.name || 'Unknown'
    })) as (JournalEntry & { partnerName: string })[]
}
