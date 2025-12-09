import api from './client'

export interface OrderItem {
    menuItemId: string
    name: string
    quantity: number
    price: number
    specialInstructions?: string
    image?: string // For frontend display
}

export interface CreateOrderData {
    items: {
        menuItemId: string
        quantity: number
        specialInstructions?: string
    }[]
    orderType: 'dine-in' | 'takeaway' | 'delivery'
    tableNumber?: string
    roomNumber?: string
    specialRequests?: string
    paymentMethod: 'cash' | 'card' | 'online'
}

export interface FoodOrder {
    _id: string
    userId: string
    items: OrderItem[]
    totalAmount: number
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
    orderType: 'dine-in' | 'takeaway' | 'delivery'
    tableNumber?: string
    estimatedTime?: number
    createdAt: string
}

export async function createFoodOrder(data: CreateOrderData) {
    const res = await api.post('/food-orders', data)
    return res.data
}

export async function getMyFoodOrders() {
    const res = await api.get('/food-orders')
    return res.data
}

export async function getFoodOrder(id: string) {
    const res = await api.get(`/food-orders/${id}`)
    return res.data
}

export async function cancelFoodOrder(id: string) {
    const res = await api.put(`/food-orders/${id}/cancel`)
    return res.data
}
