import { useQuery } from '@tanstack/react-query'
import api from './client'

export interface AboutImage {
    filename: string
    url: string
    category: 'hotel' | 'team' | 'amenities'
    size: number
    uploadedAt: string
    sizeFormatted: string
}

export interface AboutImagesResponse {
    message: string
    images: AboutImage[]
    count: number
}

export function useAboutImages(category?: 'hotel' | 'team' | 'amenities') {
    return useQuery({
        queryKey: ['about-images', category],
        queryFn: async () => {
            const params = category ? { category } : {}
            const res = await api.get<AboutImagesResponse>('/about-images/list', { params })
            return res.data
        }
    })
}
