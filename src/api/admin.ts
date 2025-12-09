import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './client'

// Admin Rooms API
export function useAdminRooms(filters?: { status?: string; type?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['admin', 'rooms', filters],
    queryFn: async () => {
      const params = filters || {}
      const res = await api.get('/admin/rooms', { params })
      return res.data
    }
  })
}

export function useCreateRoom() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (roomData: FormData) => {
      const res = await api.post('/admin/rooms', roomData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'rooms'] })
      qc.invalidateQueries({ queryKey: ['rooms'] })
    }
  })
}

export function useUpdateRoomStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ roomId, status, notes }: { roomId: string; status: string; notes?: string }) => {
      const res = await api.put(`/admin/rooms/${roomId}/status`, { status, notes })
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'rooms'] })
      qc.invalidateQueries({ queryKey: ['rooms'] })
    }
  })
}

export function useUpdateRoom() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ roomId, roomData }: { roomId: string; roomData: FormData }) => {
      const res = await api.put(`/admin/rooms/${roomId}`, roomData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'rooms'] })
      qc.invalidateQueries({ queryKey: ['rooms'] })
    }
  })
}

export function useDeleteRoom() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (roomId: string) => {
      const res = await api.delete(`/admin/rooms/${roomId}`)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'rooms'] })
      qc.invalidateQueries({ queryKey: ['rooms'] })
    }
  })
}

export function useDeleteRoomImage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ roomId, imageIndex }: { roomId: string; imageIndex: number }) => {
      const res = await api.delete(`/admin/rooms/${roomId}/images/${imageIndex}`)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'rooms'] })
      qc.invalidateQueries({ queryKey: ['rooms'] })
    }
  })
}

// Admin Users API
export function useAdminUsers(filters?: { role?: string; isActive?: boolean; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: async () => {
      const params = filters || {}
      const res = await api.get('/users', { params })
      return res.data
    }
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ userId, userData }: { userId: string; userData: any }) => {
      const res = await api.put(`/users/${userId}`, userData)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
    }
  })
}

// Admin Bookings API
export function useAdminBookings(filters?: { status?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['admin', 'bookings', filters],
    queryFn: async () => {
      const params = filters || {}
      const res = await api.get('/admin/bookings', { params })
      return res.data
    }
  })
}

export function useAcceptBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ bookingId, reason }: { bookingId: string; reason?: string }) => {
      const res = await api.put(`/admin/bookings/${bookingId}/accept`, { reason })
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'bookings'] })
      qc.invalidateQueries({ queryKey: ['bookings'] })
    }
  })
}

export function useRejectBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ bookingId, reason }: { bookingId: string; reason: string }) => {
      const res = await api.put(`/admin/bookings/${bookingId}/reject`, { reason })
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'bookings'] })
      qc.invalidateQueries({ queryKey: ['bookings'] })
    }
  })
}



export function useCompleteBooking() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const res = await api.put(`/admin/bookings/${bookingId}/complete`)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'bookings'] })
      qc.invalidateQueries({ queryKey: ['bookings'] })
    }
  })
}

// Admin Banners API
export function useAdminBanners() {
  return useQuery({
    queryKey: ['admin', 'banners'],
    queryFn: async () => {
      const res = await api.get('/admin/banners')
      return res.data
    }
  })
}

export function useUploadBanner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/admin/banners', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'banners'] })
      qc.invalidateQueries({ queryKey: ['banners'] })
    }
  })
}

export function useDeleteBanner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (bannerId: string) => {
      const res = await api.delete(`/admin/banners/${bannerId}`)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'banners'] })
      qc.invalidateQueries({ queryKey: ['banners'] })
    }
  })
}

// Admin Dashboard Stats
export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const res = await api.get('/admin/dashboard')
      return res.data
    }
  })
}

// Pending Counts for Notification Badges
export function usePendingBookingsCount() {
  return useQuery({
    queryKey: ['admin', 'bookings', 'pending-count'],
    queryFn: async () => {
      const res = await api.get('/admin/bookings', { params: { status: 'pending', limit: 1000 } })
      return res.data.pagination?.totalBookings || 0
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  })
}

export function usePendingOrdersCount() {
  return useQuery({
    queryKey: ['admin', 'orders', 'pending-count'],
    queryFn: async () => {
      // Get pending food orders
      const foodRes = await api.get('/food-orders/admin/orders', { params: { status: 'pending', limit: 1 } })
      const foodCount = foodRes.data.pagination?.totalOrders || 0

      // Get pending custom requests
      const customRes = await api.get('/custom-food-requests/admin', { params: { status: 'pending', limit: 1 } })
      const customCount = customRes.data.pagination?.total || 0

      return { total: foodCount + customCount, foodCount, customCount }
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  })
}
export function useUpdateSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (settingsData: any) => {
      const res = await api.put('/settings', settingsData)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['settings'] })
    }
  })
}
