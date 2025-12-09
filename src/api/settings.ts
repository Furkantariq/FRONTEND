import { useQuery } from '@tanstack/react-query'
import api from './client'

export interface SiteSettings {
    brand: {
        name: string
        description: string
    }
    socials: {
        facebook: string
        twitter: string
        instagram: string
    }
    contact: {
        address: string
        phone: string
        email: string
    }
}

export function useSiteSettings() {
    return useQuery<SiteSettings>({
        queryKey: ['settings'],
        queryFn: async () => {
            const res = await api.get('/settings')
            return res.data.data
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}
