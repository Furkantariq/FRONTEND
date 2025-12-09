import { env } from '../config/env'

/**
 * Convert a relative image URL to an absolute URL
 * @param imageUrl - The image URL from the backend (e.g., "/uploads/images/file.jpg")
 * @returns Full URL (e.g., "http://localhost:5001/uploads/images/file.jpg")
 */
export function getImageUrl(imageUrl: string | undefined | null): string {
    if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined') return ''

    // If it's already a full URL, return as-is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl
    }

    // Convert relative URL to absolute
    const baseUrl = env.apiBaseUrl.replace('/api', '') // Remove /api suffix
    return `${baseUrl}${imageUrl}`
}

/**
 * Get the first image from an array or single image
 * @param images - Can be a string, array of strings, or null/undefined
 * @returns First image URL or empty string
 */
export function getFirstImage(images: string | string[] | undefined | null): string {
    if (!images) return ''
    if (Array.isArray(images)) {
        return images.length > 0 ? getImageUrl(images[0]) : ''
    }
    return getImageUrl(images)
}
