'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { createJournalEntry } from '@/lib/services/journal'
import { ImageUpload } from '@/components/shared/image-upload'
import { Loader2, Plus, X } from 'lucide-react'
import Image from 'next/image'

export function JournalForm() {
    const [content, setContent] = useState('')
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!content && imageUrls.length === 0) {
            toast({
                title: 'Error',
                description: 'Please add text or an image',
                variant: 'destructive',
            })
            return
        }

        setIsSubmitting(true)
        try {
            const res = await createJournalEntry({
                content,
                image_urls: imageUrls
            })

            if (res.error) {
                toast({
                    title: 'Error',
                    description: res.error,
                    variant: 'destructive',
                })
            } else {
                toast({
                    title: 'Success',
                    description: 'Journal entry posted',
                })
                setContent('')
                setImageUrls([])
                setIsExpanded(false)
                router.refresh()
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to post entry',
                variant: 'destructive',
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const addImage = (url: string) => {
        setImageUrls(prev => [...prev, url])
    }

    const removeImage = (index: number) => {
        setImageUrls(prev => prev.filter((_, i) => i !== index))
    }

    if (!isExpanded) {
        return (
            <Button onClick={() => setIsExpanded(true)} className="w-full mb-6">
                <Plus className="w-4 h-4 mr-2" />
                New Journal Entry
            </Button>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="bg-card border rounded-lg p-4 mb-6 space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">New Entry</h3>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <Textarea
                placeholder="What's happening in operations today?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
            />

            {imageUrls.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {imageUrls.map((url, i) => (
                        <div key={i} className="relative w-24 h-24 flex-shrink-0">
                            <Image
                                src={url}
                                alt="Attachment"
                                fill
                                className="object-cover rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex justify-between items-center">
                 <div className="w-40">
                    <ImageUpload
                        onUpload={addImage}
                        folder="journal"
                        label="Add Photo"
                    />
                 </div>

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Post Entry
                </Button>
            </div>
        </form>
    )
}
