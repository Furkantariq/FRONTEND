import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './client'

export type Car = {
  _id: string
  brand: string
  model: string
  type: string
  year: number
  seats: number
  transmission: string
  fuelType: string
  rentalPrice: number
  available: boolean
  images?: string[]
  features?: string[]
}

export type CarRequest = {
  _id: string
  userId: string
  carId: string
  startDate: string
  endDate: string
  pickupLocation?: string
  dropoffLocation?: string
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
  totalAmount: number
}

export function useCars(filters?: { type?: string; minPrice?: number; maxPrice?: number }) {
  return useQuery({
    queryKey: ['cars', filters],
    queryFn: async () => {
      const params = filters || {}
      const res = await api.get('/cars', { params })
      return res.data?.cars || []
    }
  })
}

export function useMyCarRequests() {
  return useQuery({
    queryKey: ['cars', 'requests'],
    queryFn: async () => {
      const res = await api.get('/cars/rentals')
      return res.data?.rentals || []
    }
  })
}

export function useCreateCarRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: {
      carId: string
      startDate: string
      endDate: string
      driverLicense: string
      additionalDrivers?: number
      insurance?: boolean
    }) => {
      const res = await api.post('/cars/rentals', payload)
      return res.data?.rental
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['cars', 'requests'] })
    }
  })
}
