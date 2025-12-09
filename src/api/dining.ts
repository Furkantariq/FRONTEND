import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './client'

export type MenuItem = {
  _id: string
  name: string
  description?: string
  price: number
  category: string
  available: boolean
  image?: string
}

export type FoodOrder = {
  _id: string
  userId: string
  items: Array<{
    itemId: string
    name: string
    quantity: number
    price: number
  }>
  totalAmount: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  deliveryTime?: string
  specialInstructions?: string
}

export function useMenu(category?: string) {
  return useQuery({
    queryKey: ['dining', 'menu', category],
    queryFn: async () => {
      const params = category ? { category } : {}
      const res = await api.get('/dining/menu', { params })
      return res.data?.menu || []
    }
  })
}

export function useMyFoodOrders() {
  return useQuery({
    queryKey: ['dining', 'orders'],
    queryFn: async () => {
      const res = await api.get('/food-orders')
      return res.data?.orders || []
    }
  })
}

export function useCreateFoodOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: {
      items: Array<{
        itemId: string
        quantity: number
      }>
      specialInstructions?: string
    }) => {
      const res = await api.post('/food-orders', payload)
      return res.data?.order
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dining', 'orders'] })
    }
  })
}
