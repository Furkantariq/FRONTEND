import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getAdminCustomRequests,
    approveCustomRequest,
    rejectCustomRequest,
    completeCustomRequest,
    CustomFoodRequest
} from '../../api/custom-food-requests'
import Loading from '../../components/Loading'
import { Check, X, CheckCircle, Clock, Calendar, Users, DollarSign } from 'lucide-react'

export default function AdminCustomRequestsPage() {
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [page, setPage] = useState(1)
    const [processingRequest, setProcessingRequest] = useState<CustomFoodRequest | null>(null)
    const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null)

    const queryClient = useQueryClient()

    const { data, isLoading, error } = useQuery({
        queryKey: ['admin-custom-requests', statusFilter, page],
        queryFn: () => getAdminCustomRequests({ status: statusFilter || undefined, page, limit: 20 })
    })

    const approveMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => approveCustomRequest(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-custom-requests'] })
            closeModal()
            alert('Request approved successfully')
        },
        onError: (err: any) => alert(err.response?.data?.message || 'Failed to approve request')
    })

    const rejectMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => rejectCustomRequest(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-custom-requests'] })
            closeModal()
            alert('Request rejected successfully')
        },
        onError: (err: any) => alert(err.response?.data?.message || 'Failed to reject request')
    })

    const completeMutation = useMutation({
        mutationFn: completeCustomRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-custom-requests'] })
            alert('Request marked as completed')
        },
        onError: (err: any) => alert(err.response?.data?.message || 'Failed to complete request')
    })

    const closeModal = () => {
        setProcessingRequest(null)
        setActionType(null)
    }

    if (isLoading) return <Loading />
    if (error) return <div className="p-8 text-red-500">Failed to load requests</div>

    return (
        <>
            <div className="flex justify-end items-center mb-6">
                <div className="flex gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 font-medium text-gray-500">Request Details</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Customer</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Date & Time</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Guests</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Budget/Price</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {data?.requests?.map((req: CustomFoodRequest) => (
                                <tr key={req._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{req.requestTitle}</div>
                                        <div className="text-xs text-gray-500 line-clamp-2 mt-1">{req.description}</div>
                                        {req.dietaryRestrictions.length > 0 && req.dietaryRestrictions[0] !== 'none' && (
                                            <div className="flex gap-1 mt-1 flex-wrap">
                                                {req.dietaryRestrictions.map(d => (
                                                    <span key={d} className="text-[10px] bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded border border-orange-100">
                                                        {d}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium">{req.userId ? `${req.userId.firstName} ${req.userId.lastName}` : 'Unknown User'}</div>
                                        <div className="text-xs text-gray-500">{req.userId?.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3 text-gray-400" />
                                            {new Date(req.preferredDate).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1 capitalize">
                                            <Clock className="w-3 h-3" />
                                            {req.preferredTime}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-3 h-3 text-gray-400" />
                                            {req.guestCount}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {req.finalPrice ? (
                                            <span className="font-bold text-green-600">₹{req.finalPrice}</span>
                                        ) : (
                                            <span className="text-gray-500">Est: ₹{req.estimatedPrice || 0}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`text-sm px-2 py-1 rounded inline-block capitalize
                                            ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                req.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                                                    req.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        req.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-700'
                                            }`}>
                                            {req.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-2">
                                            {req.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => { setProcessingRequest(req); setActionType('approve') }}
                                                        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 flex items-center justify-center gap-1"
                                                    >
                                                        <Check className="w-3 h-3" /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => { setProcessingRequest(req); setActionType('reject') }}
                                                        className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100 flex items-center justify-center gap-1"
                                                    >
                                                        <X className="w-3 h-3" /> Reject
                                                    </button>
                                                </>
                                            )}
                                            {req.status === 'approved' && (
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Mark this request as completed?')) {
                                                            completeMutation.mutate(req._id)
                                                        }
                                                    }}
                                                    className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100 flex items-center justify-center gap-1"
                                                >
                                                    <CheckCircle className="w-3 h-3" /> Complete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {data?.requests?.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        No requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {data?.pagination && data.pagination.totalPages > 1 && (
                    <div className="px-6 py-4 border-t flex justify-between items-center bg-gray-50">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={!data.pagination.hasPrev}
                            className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {data.pagination.currentPage} of {data.pagination.totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={!data.pagination.hasNext}
                            className="px-3 py-1 rounded border bg-white disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Action Modal */}
            {processingRequest && actionType && (
                <ActionModal
                    request={processingRequest}
                    type={actionType}
                    onClose={closeModal}
                    onConfirm={(data) => {
                        if (actionType === 'approve') {
                            approveMutation.mutate({ id: processingRequest._id, data })
                        } else {
                            rejectMutation.mutate({ id: processingRequest._id, data })
                        }
                    }}
                    isPending={approveMutation.isPending || rejectMutation.isPending}
                />
            )}
        </>
    )
}

function ActionModal({ request, type, onClose, onConfirm, isPending }: {
    request: CustomFoodRequest;
    type: 'approve' | 'reject';
    onClose: () => void;
    onConfirm: (data: any) => void;
    isPending: boolean;
}) {
    const [formData, setFormData] = useState({
        finalPrice: request.estimatedPrice || '',
        adminResponse: '',
        adminNotes: ''
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onConfirm({
            ...formData,
            finalPrice: type === 'approve' ? Number(formData.finalPrice) : undefined
        })
    }

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                    <h2 className="text-xl font-bold mb-4 capitalize">{type} Request</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        {type === 'approve'
                            ? `Set the final price and send a confirmation message to ${request.userId ? `${request.userId.firstName} ${request.userId.lastName}` : 'the user'}.`
                            : `Please provide a reason for rejecting this request.`}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {type === 'approve' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Final Price ($)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="w-full border rounded-lg pl-9 pr-3 py-2"
                                        value={formData.finalPrice}
                                        onChange={e => setFormData({ ...formData, finalPrice: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Response Message (Visible to User)</label>
                            <textarea
                                required
                                className="w-full border rounded-lg px-3 py-2 h-24"
                                placeholder={type === 'approve' ? "We're happy to fulfill your request..." : "Unfortunately, we cannot fulfill this request because..."}
                                value={formData.adminResponse}
                                onChange={e => setFormData({ ...formData, adminResponse: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes (Optional)</label>
                            <textarea
                                className="w-full border rounded-lg px-3 py-2 h-16"
                                placeholder="Notes for other admins..."
                                value={formData.adminNotes}
                                onChange={e => setFormData({ ...formData, adminNotes: e.target.value })}
                            />
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
                                disabled={isPending}
                                className={`px-4 py-2 text-white rounded-lg disabled:opacity-50 ${type === 'approve' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                                    }`}
                            >
                                {isPending ? 'Processing...' : type === 'approve' ? 'Approve Request' : 'Reject Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
