import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserCustomRequests, createCustomRequest, cancelCustomRequest } from '../../api/custom-food-requests'
import Loading from '../../components/Loading'
import { Calendar, Clock, Users, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function CustomFoodRequestPage() {
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        requestTitle: '',
        description: '',
        preferredDate: '',
        preferredTime: 'any',
        guestCount: 1,
        estimatedPrice: '',
        dietaryRestrictions: [] as string[],
        specialInstructions: ''
    })

    const queryClient = useQueryClient()

    const { data, isLoading, error } = useQuery({
        queryKey: ['my-custom-requests'],
        queryFn: () => getUserCustomRequests()
    })

    const createMutation = useMutation({
        mutationFn: createCustomRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-custom-requests'] })
            setShowForm(false)
            setFormData({
                requestTitle: '',
                description: '',
                preferredDate: '',
                preferredTime: 'any',
                guestCount: 1,
                estimatedPrice: '',
                dietaryRestrictions: [],
                specialInstructions: ''
            })
            alert('Custom food request submitted successfully!')
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Failed to submit request')
        }
    })

    const cancelMutation = useMutation({
        mutationFn: cancelCustomRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-custom-requests'] })
            alert('Request cancelled successfully')
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Failed to cancel request')
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        createMutation.mutate({
            ...formData,
            estimatedPrice: formData.estimatedPrice ? Number(formData.estimatedPrice) : undefined
        })
    }

    const handleDietaryChange = (restriction: string) => {
        setFormData(prev => ({
            ...prev,
            dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
                ? prev.dietaryRestrictions.filter(r => r !== restriction)
                : [...prev.dietaryRestrictions, restriction]
        }))
    }

    if (isLoading) return <Loading />
    if (error) return <div className="container-default py-10 text-red-500">Failed to load requests</div>

    return (
        <div className="container-default py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Custom Food Requests</h2>
                    <p className="text-gray-500 mt-1">Request special meals tailored to your preferences</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    {showForm ? 'Cancel' : 'New Request'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                    <h3 className="text-xl font-bold mb-6">Submit Custom Food Request</h3>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Request Title *</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full border rounded-lg px-4 py-2"
                                    placeholder="e.g., Birthday Celebration Dinner"
                                    value={formData.requestTitle}
                                    onChange={e => setFormData({ ...formData, requestTitle: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                                <textarea
                                    required
                                    className="w-full border rounded-lg px-4 py-2 h-24"
                                    placeholder="Describe your custom meal requirements..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date *</label>
                                <input
                                    required
                                    type="date"
                                    className="w-full border rounded-lg px-4 py-2"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.preferredDate}
                                    onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                                <select
                                    className="w-full border rounded-lg px-4 py-2"
                                    value={formData.preferredTime}
                                    onChange={e => setFormData({ ...formData, preferredTime: e.target.value })}
                                >
                                    <option value="any">Any Time</option>
                                    <option value="breakfast">Breakfast</option>
                                    <option value="lunch">Lunch</option>
                                    <option value="dinner">Dinner</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Guests *</label>
                                <input
                                    required
                                    type="number"
                                    min="1"
                                    className="w-full border rounded-lg px-4 py-2"
                                    value={formData.guestCount}
                                    onChange={e => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Budget ($)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="w-full border rounded-lg px-4 py-2"
                                    placeholder="Optional"
                                    value={formData.estimatedPrice}
                                    onChange={e => setFormData({ ...formData, estimatedPrice: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Restrictions</label>
                                <div className="flex flex-wrap gap-2">
                                    {['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'nut-free', 'halal', 'kosher'].map(restriction => (
                                        <label key={restriction} className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                checked={formData.dietaryRestrictions.includes(restriction)}
                                                onChange={() => handleDietaryChange(restriction)}
                                            />
                                            <span className="text-sm capitalize">{restriction}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                                <textarea
                                    className="w-full border rounded-lg px-4 py-2 h-20"
                                    placeholder="Any additional notes or preferences..."
                                    value={formData.specialInstructions}
                                    onChange={e => setFormData({ ...formData, specialInstructions: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {createMutation.isPending ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-6">
                {data?.requests?.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Custom Requests Yet</h3>
                        <p className="text-gray-500 mb-4">Start by creating your first custom food request</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Create Request
                        </button>
                    </div>
                ) : (
                    data?.requests?.map((request: any) => (
                        <div key={request._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center flex-wrap gap-4">
                                <div>
                                    <h3 className="font-bold text-gray-900">{request.requestTitle}</h3>
                                    <p className="text-sm text-gray-500">Submitted {new Date(request.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    request.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                        request.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                    }`}>
                                    {request.status}
                                </span>
                            </div>

                            <div className="p-6">
                                <p className="text-gray-700 mb-4">{request.description}</p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(request.preferredDate).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span className="capitalize">{request.preferredTime}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Users className="w-4 h-4" />
                                        <span>{request.guestCount} Guests</span>
                                    </div>
                                    {request.finalPrice ? (
                                        <div className="flex items-center gap-2 text-sm font-bold text-green-600">
                                            <DollarSign className="w-4 h-4" />
                                            <span>${request.finalPrice}</span>
                                        </div>
                                    ) : request.estimatedPrice ? (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <DollarSign className="w-4 h-4" />
                                            <span>~${request.estimatedPrice}</span>
                                        </div>
                                    ) : null}
                                </div>

                                {request.dietaryRestrictions?.length > 0 && request.dietaryRestrictions[0] !== 'none' && (
                                    <div className="mb-4">
                                        <span className="text-sm font-medium text-gray-700">Dietary Restrictions: </span>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {request.dietaryRestrictions.map((restriction: string) => (
                                                <span key={restriction} className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded border border-orange-100 capitalize">
                                                    {restriction}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {request.adminResponse && (
                                    <div className={`mt-4 p-4 rounded-lg ${request.status === 'approved' ? 'bg-blue-50 border border-blue-100' :
                                        request.status === 'rejected' ? 'bg-red-50 border border-red-100' :
                                            'bg-gray-50 border border-gray-100'
                                        }`}>
                                        <div className="flex items-start gap-2">
                                            {request.status === 'approved' ? (
                                                <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            ) : request.status === 'rejected' ? (
                                                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                            ) : null}
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 mb-1">Admin Response:</p>
                                                <p className="text-sm text-gray-700">{request.adminResponse}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {request.status === 'pending' && (
                                    <div className="mt-4 flex justify-end">
                                        <button
                                            onClick={() => {
                                                if (confirm('Are you sure you want to cancel this request?')) {
                                                    cancelMutation.mutate(request._id)
                                                }
                                            }}
                                            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            Cancel Request
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
