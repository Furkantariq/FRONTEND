import api from './client'

export interface MenuItem {
    _id: string
    name: string
    category: string
    price: number
    description: string
    isVegetarian: boolean
    isVegan: boolean
    isGlutenFree: boolean
    isAvailable: boolean
    images: string[]
    ingredients: string[]
    allergens: string[]
    preparationTime?: number
    calories?: number
    spiceLevel?: 'mild' | 'medium' | 'hot' | 'extra-hot'
    chefSpecial: boolean
    seasonal: boolean
}

export interface CreateMenuItemData {
    name: string
    category: string
    price: number
    description: string
    isVegetarian: boolean
    isVegan: boolean
    isGlutenFree: boolean
    isAvailable: boolean
    images?: File[]
    ingredients?: string[]
    allergens?: string[]
    preparationTime?: number
    calories?: number
    spiceLevel?: string
    chefSpecial: boolean
    seasonal: boolean
}

export function useAdminMenu(params?: { category?: string; available?: boolean }) {
    return {
        queryKey: ['admin', 'menu', params],
        queryFn: async () => {
            const res = await api.get('/dining/admin/menu', { params })
            return res.data
        }
    }
}

export async function createMenuItem(data: CreateMenuItemData) {
    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('category', data.category)
    formData.append('price', data.price.toString())
    formData.append('description', data.description)
    formData.append('isVegetarian', data.isVegetarian.toString())
    formData.append('isVegan', data.isVegan.toString())
    formData.append('isGlutenFree', data.isGlutenFree.toString())
    formData.append('isAvailable', data.isAvailable.toString())
    formData.append('chefSpecial', data.chefSpecial.toString())
    formData.append('seasonal', data.seasonal.toString())

    if (data.images) {
        data.images.forEach((file) => {
            formData.append('images', file)
        })
    }

    if (data.ingredients) {
        data.ingredients.forEach((item) => formData.append('ingredients', item))
    }

    if (data.allergens) {
        data.allergens.forEach((item) => formData.append('allergens', item))
    }

    if (data.preparationTime) formData.append('preparationTime', data.preparationTime.toString())
    if (data.calories) formData.append('calories', data.calories.toString())
    if (data.spiceLevel) formData.append('spiceLevel', data.spiceLevel)

    const res = await api.post('/dining/admin/menu', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
}

export async function updateMenuItem(id: string, data: Partial<CreateMenuItemData>) {
    const formData = new FormData()
    if (data.name) formData.append('name', data.name)
    if (data.category) formData.append('category', data.category)
    if (data.price) formData.append('price', data.price.toString())
    if (data.description) formData.append('description', data.description)
    if (data.isVegetarian !== undefined) formData.append('isVegetarian', data.isVegetarian.toString())
    if (data.isVegan !== undefined) formData.append('isVegan', data.isVegan.toString())
    if (data.isGlutenFree !== undefined) formData.append('isGlutenFree', data.isGlutenFree.toString())
    if (data.isAvailable !== undefined) formData.append('isAvailable', data.isAvailable.toString())
    if (data.chefSpecial !== undefined) formData.append('chefSpecial', data.chefSpecial.toString())
    if (data.seasonal !== undefined) formData.append('seasonal', data.seasonal.toString())

    if (data.images) {
        data.images.forEach((file) => {
            formData.append('images', file)
        })
    }

    if (data.ingredients) {
        data.ingredients.forEach((item) => formData.append('ingredients', item))
    }

    if (data.allergens) {
        data.allergens.forEach((item) => formData.append('allergens', item))
    }

    if (data.preparationTime) formData.append('preparationTime', data.preparationTime.toString())
    if (data.calories) formData.append('calories', data.calories.toString())
    if (data.spiceLevel) formData.append('spiceLevel', data.spiceLevel)

    const res = await api.put(`/dining/admin/menu/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return res.data
}

export async function deleteMenuItem(id: string) {
    const res = await api.delete(`/dining/admin/menu/${id}`)
    return res.data
}

export async function updateMenuItemStatus(id: string, isAvailable: boolean) {
    const res = await api.put(`/dining/admin/menu/${id}/status`, { isAvailable })
    return res.data
}
