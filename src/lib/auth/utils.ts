import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function checkInvite(email: string) {
    const supabase = await createClient()

    // Check if email exists in invited_emails table
    const { data, error } = await supabase
        .from('invited_emails')
        .select('email')
        .eq('email', email)
        .single()

    if (error || !data) {
        return false
    }

    return true
}

export async function protectRoute() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/login')
    }

    return user
}
