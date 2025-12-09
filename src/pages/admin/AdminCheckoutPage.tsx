import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAdminCheckoutSessions, getAdminCheckoutStats, completeCheckout } from '../../api/checkout'
import Loading from '../../components/Loading'
import Modal from '../../components/Modal'
import { Receipt, DollarSign, CheckCircle, Clock, XCircle, Search, Filter, Eye } from 'lucide-react'

export default function AdminCheckoutPage() {
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [page, setPage] = useState(1)
    const [selectedSession, setSelectedSession] = useState<any>(null)
    const [paymentMethod, setPaymentMethod] = useState('cash')
    const [notes, setNotes] = useState('')
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
    const queryClient = useQueryClient()

    const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
        queryKey: ['admin-checkout-sessions', statusFilter, page],
        queryFn: () => getAdminCheckoutSessions({ status: statusFilter || undefined, page, limit: 10 })
    })

    const { data: statsData, isLoading: statsLoading } = useQuery({
        queryKey: ['admin-checkout-stats'],
        queryFn: getAdminCheckoutStats
    })

    const checkoutMutation = useMutation({
        mutationFn: completeCheckout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-checkout-sessions'] })
            queryClient.invalidateQueries({ queryKey: ['admin-checkout-stats'] })
            setSelectedSession(null)
            setNotes('')
            setIsConfirmModalOpen(false)
            setIsSuccessModalOpen(true)
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Failed to complete checkout')
            setIsConfirmModalOpen(false)
        }
    })

    const handleCompleteCheckout = () => {
        if (!selectedSession) return
        setIsConfirmModalOpen(true)
    }

    const confirmPayment = () => {
        if (!selectedSession) return
        checkoutMutation.mutate({
            checkoutId: selectedSession._id,
            paymentMethod,
            notes
        })
    }

    if (sessionsLoading || statsLoading) return <Loading />

    const stats = statsData?.stats || { totalSessions: 0, activeSessions: 0, completedSessions: 0, totalRevenue: 0 }
    const sessions = sessionsData?.sessions || []
    const pagination = sessionsData?.pagination

    return (
        <div className="container-default py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Checkout Management</h1>
                    <p className="text-gray-500">Monitor and manage guest checkouts</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <Receipt className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Checkouts</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.totalSessions}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-50 rounded-lg">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Active Sessions</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.activeSessions}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Completed</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.completedSessions}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <DollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="p-4 border-b border-gray-100 flex gap-4 items-center">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Filter className="w-4 h-4" />
                        <span className="text-sm font-medium">Filter Status:</span>
                    </div>
                    <div className="flex gap-2">
                        {['', 'active', 'completed', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${statusFilter === status
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {status || 'All'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Guest</th>
                                <th className="px-6 py-3">Stay Period</th>
                                <th className="px-6 py-3">Services</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sessions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No checkout sessions found
                                    </td>
                                </tr>
                            ) : (
                                sessions.map((session: any) => (
                                    <tr key={session._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                                                    {session.userId?.firstName?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {session.userId?.firstName} {session.userId?.lastName}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{session.userId?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div>{new Date(session.checkInDate).toLocaleDateString()}</div>
                                            <div className="text-xs">to {new Date(session.checkOutDate).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1">
                                                {session.services.some((s: any) => s.type === 'room') && (
                                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded border border-blue-100">Room</span>
                                                )}
                                                {session.services.some((s: any) => s.type === 'food') && (
                                                    <span className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded border border-orange-100">Food</span>
                                                )}
                                                {session.services.some((s: any) => s.type === 'car') && (
                                                    <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded border border-purple-100">Car</span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">{session.services.length} items total</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">₹{session.totalAmount.toFixed(2)}</div>
                                            <div className="text-xs text-gray-500">{session.paymentStatus}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize ${session.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                session.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {session.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedSession(session)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                    <div className="p-4 border-t border-gray-100 flex justify-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="px-3 py-1 text-gray-600">
                            Page {page} of {pagination.pages}
                        </span>
                        <button
                            disabled={page === pagination.pages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedSession && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
                            <h3 className="text-xl font-bold">Checkout Details</h3>
                            <button onClick={() => setSelectedSession(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <XCircle className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-500">Guest</label>
                                    <p className="font-medium">{selectedSession.userId?.firstName} {selectedSession.userId?.lastName}</p>
                                    <p className="text-sm text-gray-500">{selectedSession.userId?.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Status</label>
                                    <div className="flex gap-2 mt-1">
                                        <span className="px-2 py-0.5 bg-gray-100 rounded text-sm capitalize">{selectedSession.status}</span>
                                        <span className="px-2 py-0.5 bg-gray-100 rounded text-sm capitalize">{selectedSession.paymentStatus}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold mb-3">Services Breakdown</h4>
                                <div className="border rounded-lg divide-y">
                                    {selectedSession.services.map((item: any, idx: number) => (
                                        <div key={idx} className="p-3 border-b last:border-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-sm text-gray-900">{item.description}</p>
                                                    <p className="text-xs text-gray-500 capitalize mb-1">{item.type.replace('_', ' ')} • {new Date(item.addedAt).toLocaleDateString()}</p>

                                                    {/* Detailed Breakdown */}
                                                    {item.details && (
                                                        <div className="mt-1 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                                            {item.type === 'food' && item.details.items && (
                                                                <ul className="space-y-1">
                                                                    {item.details.items.map((foodItem: any, fIdx: number) => (
                                                                        <li key={fIdx} className="flex gap-2">
                                                                            <span className="font-medium">{foodItem.quantity}x</span>
                                                                            <span>{foodItem.name}</span>
                                                                            <span className="text-gray-400">(₹{foodItem.price})</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                            {item.type === 'room' && (
                                                                <div className="space-y-1">
                                                                    <p>Room Number: <span className="font-medium">{item.details.roomNumber}</span></p>
                                                                    <p>Type: <span className="font-medium">{item.details.roomType}</span></p>
                                                                    <p>Nights: <span className="font-medium">{item.details.overlapDays}</span></p>
                                                                </div>
                                                            )}
                                                            {item.type === 'car' && (
                                                                <div className="space-y-1">
                                                                    <p>Vehicle: <span className="font-medium">{item.details.carBrand} {item.details.carModel}</span></p>
                                                                    <p>License: <span className="font-medium">{item.details.licensePlate}</span></p>
                                                                </div>
                                                            )}
                                                            {item.type === 'custom_food' && (
                                                                <div className="space-y-1">
                                                                    <p>Request: <span className="font-medium">{item.details.requestTitle}</span></p>
                                                                    <p className="italic">"{item.details.description}"</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="font-medium text-gray-900">₹{item.amount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>₹{selectedSession.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Taxes</span>
                                    <span>₹{selectedSession.taxes.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                                    <span>Total</span>
                                    <span>₹{selectedSession.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            {selectedSession.status === 'active' && (
                                <div className="bg-white border border-gray-200 rounded-lg p-4 mt-6">
                                    <h4 className="font-bold mb-4 flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-green-600" />
                                        Complete Payment
                                    </h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                            <select
                                                className="w-full border rounded-lg px-3 py-2"
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            >
                                                <option value="cash">Cash</option>
                                                <option value="card">Credit/Debit Card</option>
                                                <option value="transfer">Bank Transfer</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                            <input
                                                type="text"
                                                className="w-full border rounded-lg px-3 py-2"
                                                placeholder="Transaction ID, receipt no..."
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCompleteCheckout}
                                        disabled={checkoutMutation.isPending}
                                        className="w-full py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
                                    >
                                        {checkoutMutation.isPending ? 'Processing Payment...' : `Mark as Paid (₹${selectedSession.totalAmount.toFixed(2)})`}
                                    </button>
                                </div>
                            )}

                            {selectedSession.checkoutNotes && selectedSession.status !== 'active' && (
                                <div>
                                    <label className="text-sm text-gray-500">Notes</label>
                                    <p className="text-sm bg-yellow-50 p-3 rounded border border-yellow-100">
                                        {selectedSession.checkoutNotes}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Modal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                title="Confirm Payment"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Are you sure you want to mark this session as paid?
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500">Total Amount:</span>
                            <span className="font-bold text-lg">₹{selectedSession?.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Payment Method:</span>
                            <span className="font-medium capitalize">{paymentMethod}</span>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={() => setIsConfirmModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmPayment}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                        >
                            Confirm Payment
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="Payment Successful"
            >
                <div className="space-y-4 text-center py-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Checkout Completed</h3>
                    <p className="text-gray-500">
                        The checkout session has been successfully marked as paid and completed.
                    </p>
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={() => setIsSuccessModalOpen(false)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
