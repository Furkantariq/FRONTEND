import api from './client'

export interface CheckoutServiceItem {
    type: 'room' | 'food' | 'car' | 'custom_food'
    serviceId: string
    serviceModel: string
    description: string
    amount: number
    status: string
    addedAt: string
    details?: any
}

export interface CheckoutSession {
    _id: string
    userId: string
    checkInDate: string
    checkOutDate: string
    numberOfNights: number
    services: CheckoutServiceItem[]
    subtotal: number
    taxes: number
    totalAmount: number
    status: 'active' | 'completed' | 'cancelled'
    paymentStatus: 'pending' | 'paid' | 'failed'
    createdAt: string
    updatedAt: string
}

export interface CompleteCheckoutData {
    checkoutId: string
    paymentMethod: string
    notes?: string
}

export async function getUserCheckoutSessions() {
    const res = await api.get('/checkout/sessions')
    return res.data
}

export async function completeCheckout(data: CompleteCheckoutData) {
    const res = await api.post('/checkout/complete', data)
    return res.data
}

export async function getCheckoutSummary(checkInDate: string, checkOutDate: string) {
    const res = await api.get('/checkout/summary', { params: { checkInDate, checkOutDate } })
    return res.data
}

export async function getAdminCheckoutSessions(params?: { status?: string; page?: number; limit?: number }) {
    const res = await api.get('/checkout/admin/sessions', { params })
    return res.data
}

export async function getAdminCheckoutStats() {
    const res = await api.get('/checkout/admin/stats')
    return res.data
}
