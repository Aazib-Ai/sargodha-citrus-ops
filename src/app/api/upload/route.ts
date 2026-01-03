import { NextResponse } from 'next/server'
import { getPresignedUploadUrl } from '@/lib/r2/client'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { fileName, contentType, folder } = await request.json()

        if (!fileName || !contentType) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const validFolders = ['receipts', 'journal']
        const targetFolder = validFolders.includes(folder) ? folder : 'uploads'

        const { url, key } = await getPresignedUploadUrl(
            fileName,
            contentType,
            targetFolder
        )

        return NextResponse.json({ url, key })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
