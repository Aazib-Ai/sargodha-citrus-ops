import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Cloudflare R2 S3-compatible client
const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
})

const BUCKET_NAME = process.env.R2_BUCKET_NAME!
const PUBLIC_URL = process.env.R2_PUBLIC_URL!

export interface UploadOptions {
    file: Buffer | Uint8Array
    fileName: string
    contentType: string
    folder?: string
}

/**
 * Upload a file to Cloudflare R2
 */
export async function uploadToR2({
    file,
    fileName,
    contentType,
    folder = 'uploads',
}: UploadOptions): Promise<{ url: string; key: string }> {
    const key = `${folder}/${Date.now()}-${fileName}`

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: contentType,
    })

    await r2Client.send(command)

    return {
        url: `${PUBLIC_URL}/${key}`,
        key,
    }
}

/**
 * Generate a presigned upload URL for direct browser uploads
 */
export async function getPresignedUploadUrl(
    fileName: string,
    contentType: string,
    folder = 'uploads',
    expiresIn = 3600
): Promise<{ url: string; key: string }> {
    const key = `${folder}/${Date.now()}-${fileName}`

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
    })

    const url = await getSignedUrl(r2Client, command, { expiresIn })

    return {
        url,
        key,
    }
}

/**
 * Generate a presigned download URL
 */
export async function getPresignedDownloadUrl(
    key: string,
    expiresIn = 3600
): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
    })

    return getSignedUrl(r2Client, command, { expiresIn })
}

/**
 * Get the public URL for an uploaded file
 */
export function getPublicUrl(key: string): string {
    return `${PUBLIC_URL}/${key}`
}

export { r2Client }
