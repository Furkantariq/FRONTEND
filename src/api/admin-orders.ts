import api from './client'

export interface AdminFoodOrder {
    _id: string
    userId: {
        _id: string
        firstName: string
        lastName: string
        email: string
        phone: string
    }
    items: {
        menuItemId: {
            _id: string
            name: string
            category: string
            price: number
        }
        name: string
        quantity: number
        price: number
        specialInstructions?: string
    }[]
    totalAmount: number
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
    orderType: 'dine-in' | 'takeaway' | 'delivery'
    tableNumber?: string
    roomNumber?: string
    specialRequests?: string
    paymentMethod: string
    createdAt: string
    updatedAt: string
}

export interface OrderStatusUpdate {
    status: string
    estimatedTime?: number
    notes?: string
}

export async function getAdminOrders(params?: { status?: string; orderType?: string; page?: number; limit?: number }) {
    const res = await api.get('/food-orders/admin/orders', { params })
    return res.data
}

export async function getPendingOrders() {
    const res = await api.get('/food-orders/admin/orders/pending')
    return res.data
}

export async function updateOrderStatus(orderId: string, data: OrderStatusUpdate) {
    const res = await api.put(`/food-orders/admin/orders/${orderId}/status`, data)
    return res.data
}

export async function deleteOrder(orderId: string) {
    const res = await api.delete(`/food-orders/admin/orders/${orderId}`)
    return res.data
}

export async function getOrderAnalytics() {
    const res = await api.get('/food-orders/admin/orders/analytics')
    return res.data
}
