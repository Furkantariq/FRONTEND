import { useQuery } from '@tanstack/react-query'
import api from './client'

export type Room = {
  _id: string
  roomNumber?: string
  type?: string
  price?: number
  images?: string[]
  description?: string
}

export function useRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const res = await api.get('/rooms')
      return res.data?.rooms || res.data
    },
  })
}

export function useRoom(id: string) {
  return useQuery({
    queryKey: ['rooms', id],
    queryFn: async () => {
      const res = await api.get(`/rooms/${id}`)
      return res.data?.room || res.data
    },
    enabled: !!id,
  })
}


