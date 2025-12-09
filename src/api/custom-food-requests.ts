import api from './client'

export interface CustomFoodRequest {
    _id: string
    userId: {
        _id: string
        firstName: string
        lastName: string
        email: string
    }
    requestTitle: string
    description: string
    preferredDate: string
    preferredTime: 'breakfast' | 'lunch' | 'dinner' | 'any'
    guestCount: number
    estimatedPrice?: number
    dietaryRestrictions: string[]
    specialInstructions?: string
    status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
    adminNotes?: string
    adminResponse?: string
    finalPrice?: number
    approvedDate?: string
    completedDate?: string
    createdAt: string
    updatedAt: string
}

export interface CreateRequestData {
    requestTitle: string
    description: string
    preferredDate: string
    preferredTime?: string
    guestCount: number
    estimatedPrice?: number
    dietaryRestrictions?: string[]
    specialInstructions?: string
}

export interface ApproveRequestData {
    finalPrice: number
    adminResponse: string
    adminNotes?: string
}

export interface RejectRequestData {
    adminResponse: string
    adminNotes?: string
}

// User endpoints
export async function createCustomRequest(data: CreateRequestData) {
    const res = await api.post('/custom-food-requests', data)
    return res.data
}

export async function getUserCustomRequests(status?: string) {
    const res = await api.get('/custom-food-requests/user', { params: { status } })
    return res.data
}

export async function cancelCustomRequest(requestId: string) {
    const res = await api.post(`/custom-food-requests/${requestId}/cancel`)
    return res.data
}

// Admin endpoints
export async function getAdminCustomRequests(params?: { status?: string; page?: number; limit?: number }) {
    const res = await api.get('/custom-food-requests/admin/all', { params })
    return res.data
}

export async function approveCustomRequest(requestId: string, data: ApproveRequestData) {
    const res = await api.post(`/custom-food-requests/admin/${requestId}/approve`, data)
    return res.data
}

export async function rejectCustomRequest(requestId: string, data: RejectRequestData) {
    const res = await api.post(`/custom-food-requests/admin/${requestId}/reject`, data)
    return res.data
}

export async function completeCustomRequest(requestId: string) {
    const res = await api.post(`/custom-food-requests/admin/${requestId}/complete`)
    return res.data
}

export async function getCustomRequestStats() {
    const res = await api.get('/custom-food-requests/admin/stats')
    return res.data
}
