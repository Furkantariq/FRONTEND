import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAdminCars, createCar, deleteCar, updateCarStatus, updateCar, Car } from '../../api/admin-cars'
import { Plus, Filter, Edit2, Trash2, Car as CarIcon, Users, Wind } from 'lucide-react'
import Loading from '../../components/Loading'
import { getFirstImage } from '../../utils/imageUrl'

export default function AdminCarsPage() {
    const queryClient = useQueryClient()
    const [filters, setFilters] = useState({ type: '', status: '' })
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [editingCar, setEditingCar] = useState<Car | null>(null)

    // Fetch Cars
    const { data, isLoading } = useQuery(useAdminCars(filters))
    const cars: Car[] = data?.cars || []

    // Mutations
    const deleteMutation = useMutation({
        mutationFn: deleteCar,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'cars'] }),
        onError: (error: any) => alert(error.response?.data?.message || 'Failed to delete car')
    })

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => updateCarStatus(id, status),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'cars'] }),
        onError: (error: any) => alert(error.response?.data?.message || 'Failed to update status')
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateCar(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'cars'] })
            setEditingCar(null)
        },
        onError: (error: any) => alert(error.response?.data?.message || 'Failed to update car')
    })

    if (isLoading) return <Loading />

    return (
        <div className="container-default py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Car Management</h1>
                    <p className="text-gray-500 mt-1">Manage fleet vehicles and availability</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Vehicle
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
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                    <option value="">All Types</option>
                    <option value="economy">Economy</option>
                    <option value="compact">Compact</option>
                    <option value="midsize">Midsize</option>
                    <option value="fullsize">Fullsize</option>
                    <option value="luxury">Luxury</option>
                    <option value="suv">SUV</option>
                    <option value="van">Van</option>
                </select>
                <select
                    className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                    <option value="">All Status</option>
                    <option value="available">Available</option>
                    <option value="in-service">In Service</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="out-of-service">Out of Service</option>
                </select>
            </div>

            {/* Cars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                    <div key={car._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="relative h-48 bg-gray-100">
                            {car.images && car.images.length > 0 ? (
                                <img
                                    src={getFirstImage(car.images)}
                                    alt={`${car.make} ${car.model}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <CarIcon className="w-12 h-12" />
                                </div>
                            )}
                            <div className="absolute top-4 right-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md
                                    ${car.status === 'available' ? 'bg-green-500/90 text-white' :
                                        car.status === 'maintenance' ? 'bg-yellow-500/90 text-white' :
                                            'bg-gray-500/90 text-white'}`}>
                                    {car.status}
                                </span>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{car.year} {car.make} {car.model}</h3>
                                    <p className="text-sm text-gray-500">{car.carNumber}</p>
                                </div>
                                <span className="font-bold text-blue-600">₹{car.price}/day</span>
                            </div>

                            <div className="flex gap-4 mt-4 mb-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>{car.numberOfSeats} Seats</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Wind className="w-4 h-4" />
                                    <span>{car.hasAC ? 'AC' : 'No AC'}</span>
                                </div>
                            </div>

                            <div className="mt-4 mb-3">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={car.status}
                                    onChange={(e) => statusMutation.mutate({ id: car._id, status: e.target.value })}
                                    className="w-full text-sm border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="available">Available</option>
                                    <option value="in-service">In Service</option>
                                    <option value="maintenance">Maintenance</option>
                                    <option value="out-of-service">Out of Service</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-gray-50">
                                <button
                                    onClick={() => setEditingCar(car)}
                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this car?')) {
                                            deleteMutation.mutate(car._id)
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

            {cars.length === 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CarIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No cars found</h3>
                    <p className="text-gray-500">Try adjusting your filters or add a new vehicle.</p>
                </div>
            )}

            {isCreateModalOpen && (
                <CreateCarModal onClose={() => setIsCreateModalOpen(false)} />
            )}

            {editingCar && (
                <EditCarModal
                    car={editingCar}
                    onClose={() => setEditingCar(null)}
                    onUpdate={updateMutation}
                />
            )}
        </div>
    )
}

function CreateCarModal({ onClose }: { onClose: () => void }) {
    const queryClient = useQueryClient()
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        carNumber: '',
        numberOfSeats: 4,
        price: '',
        hasAC: true,
        type: 'economy'
    })
    const [selectedImages, setSelectedImages] = useState<File[]>([])

    const createMutation = useMutation({
        mutationFn: (data: any) => createCar(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'cars'] })
            onClose()
        },
        onError: (error: any) => {
            console.error('Failed to create car:', error)
            alert(error.response?.data?.message || 'Failed to create car')
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const submitData = {
            ...formData,
            price: parseFloat(formData.price),
            images: selectedImages
        }

        createMutation.mutate(submitData as any)
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Add New Vehicle</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                            <input
                                required
                                type="text"
                                className="w-full border rounded-lg px-3 py-2"
                                value={formData.make}
                                onChange={e => setFormData({ ...formData, make: e.target.value })}
                                placeholder="e.g. Toyota"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                            <input
                                required
                                type="text"
                                className="w-full border rounded-lg px-3 py-2"
                                value={formData.model}
                                onChange={e => setFormData({ ...formData, model: e.target.value })}
                                placeholder="e.g. Camry"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <input
                                required
                                type="number"
                                className="w-full border rounded-lg px-3 py-2"
                                value={formData.year}
                                onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Car Number</label>
                            <input
                                required
                                type="text"
                                className="w-full border rounded-lg px-3 py-2"
                                value={formData.carNumber}
                                onChange={e => setFormData({ ...formData, carNumber: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate (₹)</label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                className="w-full border rounded-lg px-3 py-2"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                className="w-full border rounded-lg px-3 py-2"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="economy">Economy</option>
                                <option value="compact">Compact</option>
                                <option value="midsize">Midsize</option>
                                <option value="fullsize">Fullsize</option>
                                <option value="luxury">Luxury</option>
                                <option value="suv">SUV</option>
                                <option value="van">Van</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                            <input
                                required
                                type="number"
                                min="1"
                                max="15"
                                className="w-full border rounded-lg px-3 py-2"
                                value={formData.numberOfSeats}
                                onChange={e => setFormData({ ...formData, numberOfSeats: parseInt(e.target.value) })}
                            />
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
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.hasAC}
                            onChange={e => setFormData({ ...formData, hasAC: e.target.checked })}
                            id="hasAC"
                        />
                        <label htmlFor="hasAC" className="text-sm text-gray-700">Vehicle has Air Conditioning</label>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
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
                            {createMutation.isPending ? 'Creating...' : 'Create Vehicle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

function EditCarModal({ car, onClose, onUpdate }: { car: Car; onClose: () => void; onUpdate: any }) {
    const [formData, setFormData] = useState({
        make: car.make || '',
        model: car.model || '',
        year: car.year || new Date().getFullYear(),
        carNumber: car.carNumber || '',
        numberOfSeats: car.numberOfSeats || 4,
        price: car.price?.toString() || '',
        hasAC: car.hasAC !== undefined ? car.hasAC : true,
        type: car.type || 'economy'
    })
    const [selectedImages, setSelectedImages] = useState<File[]>([])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const submitData = {
            ...formData,
            price: parseFloat(formData.price),
            images: selectedImages
        }

        onUpdate.mutate({ id: car._id, data: submitData })
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Edit Vehicle</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Make</label>
                            <input
                                required
                                type="text"
                                className="w-full border rounded-lg px-3 py-2"
                                value={formData.make}
                                onChange={e => setFormData({ ...formData, make: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                            <input
                                required
                                type="text"
                                className="w-full border rounded-lg px-3 py-2"
                                value={formData.model}
                                onChange={e => setFormData({ ...formData, model: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <input
                                required
                                type="number"
                                className="w-full border rounded-lg px-3 py-2"
                                value={formData.year}
                                onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Car Number</label>
                            <input
                                required
                                type="text"
                                className="w-full border rounded-lg px-3 py-2"
                                value={formData.carNumber}
                                onChange={e => setFormData({ ...formData, carNumber: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Daily Rate (₹)</label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                className="w-full border rounded-lg px-3 py-2"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                className="w-full border rounded-lg px-3 py-2"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="economy">Economy</option>
                                <option value="compact">Compact</option>
                                <option value="midsize">Midsize</option>
                                <option value="fullsize">Fullsize</option>
                                <option value="luxury">Luxury</option>
                                <option value="suv">SUV</option>
                                <option value="van">Van</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                            <input
                                required
                                type="number"
                                min="1"
                                max="15"
                                className="w-full border rounded-lg px-3 py-2"
                                value={formData.numberOfSeats}
                                onChange={e => setFormData({ ...formData, numberOfSeats: parseInt(e.target.value) })}
                            />
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

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.hasAC}
                            onChange={e => setFormData({ ...formData, hasAC: e.target.checked })}
                            id="hasAC-edit"
                        />
                        <label htmlFor="hasAC-edit" className="text-sm text-gray-700">Vehicle has Air Conditioning</label>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
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
                            {onUpdate.isPending ? 'Updating...' : 'Update Vehicle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
