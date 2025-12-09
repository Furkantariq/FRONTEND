import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAdminMenu, createMenuItem, deleteMenuItem, updateMenuItemStatus, updateMenuItem, MenuItem } from '../../api/admin-dining'
import { Plus, Search, Filter, Edit2, Trash2, CheckCircle, XCircle, Utensils } from 'lucide-react'
import Loading from '../../components/Loading'
import { getFirstImage } from '../../utils/imageUrl'

export default function AdminDiningPage() {
    const queryClient = useQueryClient()
    const [filters, setFilters] = useState({ category: '', available: undefined as boolean | undefined })
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

    // Fetch Menu Items
    const { data, isLoading } = useQuery(useAdminMenu(filters))
    const menuItems: MenuItem[] = data?.menuItems || []

    // Mutations
    const deleteMutation = useMutation({
        mutationFn: deleteMenuItem,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'menu'] })
    })

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: boolean }) => updateMenuItemStatus(id, status),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'menu'] })
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateMenuItem(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'menu'] })
            setEditingItem(null)
        },
        onError: (error: any) => alert(error.response?.data?.message || 'Failed to update item')
    })

    if (isLoading) return <Loading />

    return (
        <div className="container-default py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dining Management</h1>
                    <p className="text-gray-500 mt-1">Manage restaurant menu items and availability</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Item
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4 items-center">
                <div className="flex items-center gap-2 text-gray-500">
                    <Filter className="w-5 h-5" />
                    <span className="font-medium">Filters:</span>
                </div>
                <select
                    className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                    <option value="">All Categories</option>
                    <option value="appetizers">Appetizers</option>
                    <option value="main-course">Main Course</option>
                    <option value="desserts">Desserts</option>
                    <option value="beverages">Beverages</option>
                    <option value="breakfast">Breakfast</option>
                </select>
                <select
                    className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={filters.available === undefined ? '' : filters.available.toString()}
                    onChange={(e) => setFilters({ ...filters, available: e.target.value === '' ? undefined : e.target.value === 'true' })}
                >
                    <option value="">All Status</option>
                    <option value="true">Available</option>
                    <option value="false">Unavailable</option>
                </select>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => (
                    <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="relative h-48 bg-gray-100">
                            {item.images?.[0] ? (
                                <img
                                    src={getFirstImage(item.images)}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div>' }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Utensils className="w-12 h-12" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    onClick={() => statusMutation.mutate({ id: item._id, status: !item.isAvailable })}
                                    className={`p-2 rounded-full backdrop-blur-md ${item.isAvailable ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}
                                    title={item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                                >
                                    {item.isAvailable ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">
                                        {item.category}
                                    </span>
                                </div>
                                <span className="font-bold text-blue-600">₹{item.price}</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                                {item.isVegetarian && <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">Vegetarian</span>}
                                {item.isVegan && <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">Vegan</span>}
                                {item.isGlutenFree && <span className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100">GF</span>}
                                {item.chefSpecial && <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-100">Chef's Special</span>}
                                {item.seasonal && <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">Seasonal</span>}
                                {item.spiceLevel && item.spiceLevel !== 'mild' && (
                                    <span className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded-full border border-red-100 capitalize">
                                        {item.spiceLevel} Spice
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                {item.preparationTime && (
                                    <span className="flex items-center gap-1">
                                        ⏱️ {item.preparationTime}m
                                    </span>
                                )}
                                {item.calories && (
                                    <span className="flex items-center gap-1">
                                        🔥 {item.calories} cal
                                    </span>
                                )}
                            </div>

                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>

                            <div className="mb-4">
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {item.isAvailable ? 'Available' : 'Unavailable'}
                                </span>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-gray-50">
                                <button
                                    onClick={() => setEditingItem(item)}
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this item?')) {
                                            deleteMutation.mutate(item._id)
                                        }
                                    }}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {menuItems.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Utensils className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No menu items found</h3>
                    <p className="text-gray-500">Try adjusting your filters or add a new item.</p>
                </div>
            )}

            {/* Create Modal would go here - simplified for now */}
            {isCreateModalOpen && (
                <CreateMenuItemModal onClose={() => setIsCreateModalOpen(false)} />
            )}

            {editingItem && (
                <EditMenuItemModal
                    item={editingItem}
                    onClose={() => setEditingItem(null)}
                    onUpdate={updateMutation}
                />
            )}
        </div>
    )
}

function CreateMenuItemModal({ onClose }: { onClose: () => void }) {
    const queryClient = useQueryClient()
    const [formData, setFormData] = useState({
        name: '',
        category: 'main-course',
        price: '',
        description: '',
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        isAvailable: true,
        chefSpecial: false,
        seasonal: false,
        preparationTime: '',
        calories: '',
        spiceLevel: 'mild',
        ingredients: '',
        allergens: [] as string[]
    })
    const [selectedImages, setSelectedImages] = useState<File[]>([])

    const allergenOptions = ['dairy', 'eggs', 'fish', 'shellfish', 'tree-nuts', 'peanuts', 'wheat', 'soy']

    const createMutation = useMutation({
        mutationFn: (data: any) => createMenuItem(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'menu'] })
            onClose()
        },
        onError: (error: any) => {
            console.error('Failed to create menu item:', error)
            alert(error.response?.data?.message || 'Failed to create menu item')
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const submitData = {
            ...formData,
            price: parseFloat(formData.price),
            preparationTime: formData.preparationTime ? parseInt(formData.preparationTime) : undefined,
            calories: formData.calories ? parseInt(formData.calories) : undefined,
            ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i),
            images: selectedImages
        }

        createMutation.mutate(submitData as any)
    }

    const handleAllergenChange = (allergen: string) => {
        setFormData(prev => ({
            ...prev,
            allergens: prev.allergens.includes(allergen)
                ? prev.allergens.filter(a => a !== allergen)
                : [...prev.allergens, allergen]
        }))
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 my-8">
                    <h2 className="text-xl font-bold mb-4">Add Menu Item</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="appetizers">Appetizers</option>
                                    <option value="main-course">Main Course</option>
                                    <option value="desserts">Desserts</option>
                                    <option value="beverages">Beverages</option>
                                    <option value="breakfast">Breakfast</option>
                                    <option value="lunch">Lunch</option>
                                    <option value="dinner">Dinner</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (mins)</label>
                                <input
                                    type="number"
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={formData.preparationTime}
                                    onChange={e => setFormData({ ...formData, preparationTime: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                                <input
                                    type="number"
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={formData.calories}
                                    onChange={e => setFormData({ ...formData, calories: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                required
                                className="w-full border rounded-lg px-3 py-2 h-20"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients (comma separated)</label>
                            <textarea
                                className="w-full border rounded-lg px-3 py-2 h-16"
                                value={formData.ingredients}
                                onChange={e => setFormData({ ...formData, ingredients: e.target.value })}
                                placeholder="e.g. Chicken, Rice, Spices, Garlic"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Spice Level</label>
                                <select
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={formData.spiceLevel}
                                    onChange={e => setFormData({ ...formData, spiceLevel: e.target.value })}
                                >
                                    <option value="mild">Mild</option>
                                    <option value="medium">Medium</option>
                                    <option value="hot">Hot</option>
                                    <option value="extra-hot">Extra Hot</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Allergens</label>
                                <div className="flex flex-wrap gap-2">
                                    {allergenOptions.map(allergen => (
                                        <label key={allergen} className="inline-flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border cursor-pointer hover:bg-gray-100">
                                            <input
                                                type="checkbox"
                                                checked={formData.allergens.includes(allergen)}
                                                onChange={() => handleAllergenChange(allergen)}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-xs capitalize">{allergen}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setSelectedImages(Array.from(e.target.files))
                                    }
                                }}
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            />
                            {selectedImages.length > 0 && (
                                <div className="mt-2 flex gap-2 flex-wrap">
                                    {selectedImages.map((file, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Preview ${index + 1}`}
                                                className="w-16 h-16 object-cover rounded border"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))}
                                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tags & Flags</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isVegetarian}
                                        onChange={e => setFormData({ ...formData, isVegetarian: e.target.checked })}
                                        className="rounded text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">Vegetarian</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isVegan}
                                        onChange={e => setFormData({ ...formData, isVegan: e.target.checked })}
                                        className="rounded text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">Vegan</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isGlutenFree}
                                        onChange={e => setFormData({ ...formData, isGlutenFree: e.target.checked })}
                                        className="rounded text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">Gluten Free</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.chefSpecial}
                                        onChange={e => setFormData({ ...formData, chefSpecial: e.target.checked })}
                                        className="rounded text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">Chef's Special</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.seasonal}
                                        onChange={e => setFormData({ ...formData, seasonal: e.target.checked })}
                                        className="rounded text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">Seasonal</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isAvailable}
                                        onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })}
                                        className="rounded text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">Available</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {createMutation.isPending ? 'Creating...' : 'Create Item'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

function EditMenuItemModal({ item, onClose, onUpdate }: { item: MenuItem; onClose: () => void; onUpdate: any }) {
    const [formData, setFormData] = useState({
        name: item.name || '',
        category: item.category || 'main-course',
        price: item.price?.toString() || '',
        description: item.description || '',
        isVegetarian: item.isVegetarian || false,
        isVegan: item.isVegan || false,
        isGlutenFree: item.isGlutenFree || false,
        isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
        chefSpecial: item.chefSpecial || false,
        seasonal: item.seasonal || false,
        preparationTime: item.preparationTime?.toString() || '',
        calories: item.calories?.toString() || '',
        spiceLevel: (item.spiceLevel || 'mild') as any,
        ingredients: item.ingredients?.join(', ') || '',
        allergens: item.allergens || [] as string[]
    })
    const [selectedImages, setSelectedImages] = useState<File[]>([])

    const allergenOptions = ['dairy', 'eggs', 'fish', 'shellfish', 'tree-nuts', 'peanuts', 'wheat', 'soy']

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const submitData = {
            ...formData,
            price: parseFloat(formData.price),
            preparationTime: formData.preparationTime ? parseInt(formData.preparationTime) : undefined,
            calories: formData.calories ? parseInt(formData.calories) : undefined,
            ingredients: formData.ingredients.split(',').map(i => i.trim()).filter(i => i),
            images: selectedImages
        }

        onUpdate.mutate({ id: item._id, data: submitData })
    }

    const handleAllergenChange = (allergen: string) => {
        setFormData(prev => ({
            ...prev,
            allergens: prev.allergens.includes(allergen)
                ? prev.allergens.filter(a => a !== allergen)
                : [...prev.allergens, allergen]
        }))
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 my-8">
                    <h2 className="text-xl font-bold mb-4">Edit Menu Item</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="appetizers">Appetizers</option>
                                    <option value="main-course">Main Course</option>
                                    <option value="desserts">Desserts</option>
                                    <option value="beverages">Beverages</option>
                                    <option value="breakfast">Breakfast</option>
                                    <option value="lunch">Lunch</option>
                                    <option value="dinner">Dinner</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Prep Time (mins)</label>
                                <input
                                    type="number"
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={formData.preparationTime}
                                    onChange={e => setFormData({ ...formData, preparationTime: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                                <input
                                    type="number"
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={formData.calories}
                                    onChange={e => setFormData({ ...formData, calories: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                required
                                className="w-full border rounded-lg px-3 py-2 h-20"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients (comma separated)</label>
                            <textarea
                                className="w-full border rounded-lg px-3 py-2 h-16"
                                value={formData.ingredients}
                                onChange={e => setFormData({ ...formData, ingredients: e.target.value })}
                                placeholder="e.g. Chicken, Rice, Spices, Garlic"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Spice Level</label>
                                <select
                                    className="w-full border rounded-lg px-3 py-2"
                                    value={formData.spiceLevel}
                                    onChange={e => setFormData({ ...formData, spiceLevel: e.target.value })}
                                >
                                    <option value="mild">Mild</option>
                                    <option value="medium">Medium</option>
                                    <option value="hot">Hot</option>
                                    <option value="extra-hot">Extra Hot</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Allergens</label>
                                <div className="flex flex-wrap gap-2">
                                    {allergenOptions.map(allergen => (
                                        <label key={allergen} className="inline-flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border cursor-pointer hover:bg-gray-100">
                                            <input
                                                type="checkbox"
                                                checked={formData.allergens.includes(allergen)}
                                                onChange={() => handleAllergenChange(allergen)}
                                                className="rounded text-blue-600"
                                            />
                                            <span className="text-xs capitalize">{allergen}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Images (optional)</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setSelectedImages(Array.from(e.target.files))
                                    }
                                }}
                                className="w-full border rounded-lg px-3 py-2 text-sm"
                            />
                            {selectedImages.length > 0 && (
                                <div className="mt-2 flex gap-2 flex-wrap">
                                    {selectedImages.map((file, index) => (
                                        <img
                                            key={index}
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${index + 1}`}
                                            className="w-16 h-16 object-cover rounded border"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tags & Flags</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isVegetarian}
                                        onChange={e => setFormData({ ...formData, isVegetarian: e.target.checked })}
                                        className="rounded text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">Vegetarian</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isVegan}
                                        onChange={e => setFormData({ ...formData, isVegan: e.target.checked })}
                                        className="rounded text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">Vegan</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isGlutenFree}
                                        onChange={e => setFormData({ ...formData, isGlutenFree: e.target.checked })}
                                        className="rounded text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">Gluten Free</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.chefSpecial}
                                        onChange={e => setFormData({ ...formData, chefSpecial: e.target.checked })}
                                        className="rounded text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">Chef's Special</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.seasonal}
                                        onChange={e => setFormData({ ...formData, seasonal: e.target.checked })}
                                        className="rounded text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">Seasonal</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isAvailable}
                                        onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })}
                                        className="rounded text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">Available</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={onUpdate.isPending}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {onUpdate.isPending ? 'Updating...' : 'Update Item'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
