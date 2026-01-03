'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { getPublicUrl } from '@/lib/r2/client'

interface ImageUploadProps {
    onUpload: (url: string) => void
    folder?: 'receipts' | 'journal' | 'uploads'
    label?: string
    disabled?: boolean
}

export function ImageUpload({ onUpload, folder = 'uploads', label = 'Upload Image', disabled }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Basic validation
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file')
            return
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('File size must be less than 5MB')
            return
        }

        setUploading(true)
        setPreview(URL.createObjectURL(file))

        try {
            // Get presigned URL
            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                    folder,
                }),
            })

            if (!res.ok) throw new Error('Failed to get upload URL')

            const { url, key } = await res.json()

            // Upload to R2
            const uploadRes = await fetch(url, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type },
            })

            if (!uploadRes.ok) throw new Error('Failed to upload file')

            // Return public URL
            const publicUrl = getPublicUrl(key)
            onUpload(publicUrl)

        } catch (error) {
            console.error(error)
            alert('Upload failed. Please try again.')
            setPreview(null)
        } finally {
            setUploading(false)
        }
    }

    const clearImage = () => {
        setPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="space-y-4">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={disabled || uploading}
            />

            {preview ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover"
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full"
                        onClick={clearImage}
                        disabled={disabled}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <Button
                    type="button"
                    variant="outline"
                    className="w-full h-32 flex flex-col gap-2 border-dashed"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled || uploading}
                >
                    {uploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    ) : (
                        <Upload className="h-8 w-8 text-muted-foreground" />
                    )}
                    <span className="text-muted-foreground">
                        {uploading ? 'Uploading...' : label}
                    </span>
                </Button>
            )}
        </div>
    )
}
