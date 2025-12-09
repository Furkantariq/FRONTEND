import api from './client'

export interface Car {
    _id: string
    make: string
    model: string
    year: number
    carNumber: string
    numberOfSeats: number
    price: number
    hasAC: boolean
    status: 'available' | 'in-service' | 'maintenance' | 'out-of-service'
    images: string[]
    type?: string
}

export interface CreateCarData {
    make: string
    model: string
    year: number
    carNumber: string
    numberOfSeats: number
    price: number
    hasAC: boolean
    images?: File[]
    type?: string
}

export function useAdminCars(params?: { type?: string; status?: string }) {
    return {
        queryKey: ['admin', 'cars', params],
        queryFn: async () => {
            const res = await api.get('/cars', { params })
            return res.data
        }
    }
}

export async function createCar(data: CreateCarData) {
    const formData = new FormData()
    formData.append('make', data.make)
    formData.append('model', data.model)
    formData.append('year', data.year.toString())
    formData.append('carNumber', data.carNumber)
    formData.append('numberOfSeats', data.numberOfSeats.toString())
    formData.append('price', data.price.toString())
    formData.append('hasAC', data.hasAC.toString())

    if (data.type) formData.append('type', data.type)

    if (data.images) {
        data.images.forEach((file) => {
            formData.append('images', file)
        })
    }

    const res = await api.post('/cars', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
}

export async function updateCar(id: string, data: Partial<CreateCarData>) {
    const formData = new FormData()
    if (data.make) formData.append('make', data.make)
    if (data.model) formData.append('model', data.model)
    if (data.year) formData.append('year', data.year.toString())
    if (data.carNumber) formData.append('carNumber', data.carNumber)
    if (data.numberOfSeats) formData.append('numberOfSeats', data.numberOfSeats.toString())
    if (data.price) formData.append('price', data.price.toString())
    if (data.hasAC !== undefined) formData.append('hasAC', data.hasAC.toString())
    if (data.type) formData.append('type', data.type)

    if (data.images) {
        data.images.forEach((file) => {
            formData.append('images', file)
        })
    }

    const res = await api.put(`/cars/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
}

export async function deleteCar(id: string) {
    const res = await api.delete(`/cars/${id}`)
    return res.data
}

export async function updateCarStatus(id: string, status: string) {
    // Note: The backend might not have a specific endpoint for just status update, 
    // but usually updateCar can handle it. If there's a specific one, we'd use it.
    // Based on previous patterns, we might need to use the general update endpoint 
    // or check if there's a specific status endpoint. 
    // Looking at routes, there isn't a specific status endpoint for cars like there is for dining.
    // So we'll use the general update.
    const res = await api.put(`/cars/${id}`, { status })
    return res.data
}
