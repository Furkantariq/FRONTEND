import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './client'

export type Guest = {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  isPrimary?: boolean
}

export type Booking = {
  _id: string
  userId: string
  roomId: any
  checkInDate: string
  checkOutDate: string
  numberOfGuests: number
  guests: Guest[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded'
}

export function useMyBookings() {
  return useQuery({
    queryKey: ['bookings','me'],
    queryFn: async () => {
      const res = await api.get('/bookings')
      return res.data?.bookings || []
    }
  })
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: async () => {
      const res = await api.get(`/bookings/${id}`)
      return res.data?.booking
    },
    enabled: !!id,
  })
}

export function useCreateBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: {
      roomId: string
      checkInDate: string
      checkOutDate: string
      numberOfGuests: number
      guests: Guest[]
      specialRequests?: string
    }) => {
      const res = await api.post('/bookings', payload)
      return res.data?.booking
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bookings','me'] })
    }
  })
}

export function useCancelBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const res = await api.put(`/bookings/${id}/cancel`, { reason })
      return res.data?.booking
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['bookings','me'] })
      qc.invalidateQueries({ queryKey: ['bookings', variables.id] })
    }
  })
}


