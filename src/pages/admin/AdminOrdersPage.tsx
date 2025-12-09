import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAdminOrders, updateOrderStatus, deleteOrder, AdminFoodOrder } from '../../api/admin-orders'
import Loading from '../../components/Loading'
import Modal from '../../components/Modal'

export default function AdminOrdersPage() {
    const [statusFilter, setStatusFilter] = useState<string>('')
    const [page, setPage] = useState(1)
    const queryClient = useQueryClient()

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
    const [newStatus, setNewStatus] = useState<string>('')
    const [estimatedTime, setEstimatedTime] = useState<string>('')

    const { data, isLoading, error } = useQuery({
        queryKey: ['admin-orders', statusFilter, page],
        queryFn: () => getAdminOrders({ status: statusFilter || undefined, page, limit: 20 })
    })

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status, estimatedTime }: { id: string; status: string; estimatedTime?: number }) =>
            updateOrderStatus(id, { status, estimatedTime }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
            // alert('Order status updated successfully') // Removed alert for better UX
            closeModal()
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Failed to update status')
        }
    })

    const deleteMutation = useMutation({
        mutationFn: deleteOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
            alert('Order deleted successfully')
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Failed to delete order')
        }
    })

    const handleStatusUpdate = (id: string, status: string) => {
        if (status === 'confirmed' || status === 'preparing') {
            setSelectedOrderId(id)
            setNewStatus(status)
            setEstimatedTime('')
            setIsModalOpen(true)
        } else {
            if (window.confirm(`Are you sure you want to change status to ${status}?`)) {
                updateStatusMutation.mutate({ id, status })
            }
        }
    }

    const confirmStatusUpdate = () => {
        if (selectedOrderId && newStatus) {
            const time = estimatedTime ? parseInt(estimatedTime) : undefined
            updateStatusMutation.mutate({
                id: selectedOrderId,
                status: newStatus,
                estimatedTime: time
            })
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedOrderId(null)
        setNewStatus('')
        setEstimatedTime('')
    }

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this order? This cannot be undone.')) {
            deleteMutation.mutate(id)
        }
    }

    if (isLoading) return <Loading />
    if (error) return <div className="p-8 text-red-500">Failed to load orders</div>

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
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 font-medium text-gray-500">Order ID</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Customer</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Type</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Items</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Total</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Date</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {data?.orders?.map((order: AdminFoodOrder) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-xs">#{order._id.slice(-6)}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium">{order.userId?.firstName} {order.userId?.lastName}</div>
                                        <div className="text-xs text-gray-500">{order.userId?.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="capitalize font-medium block">{order.orderType}</span>
                                        {order.tableNumber && <span className="text-xs text-gray-500">Table: {order.tableNumber}</span>}
                                        {order.roomNumber && <span className="text-xs text-gray-500">Room: {order.roomNumber}</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="text-xs">
                                                    <span className="font-medium">{item.quantity}x</span> {item.name}
                                                    {item.specialInstructions && <span className="text-gray-500 italic"> ({item.specialInstructions})</span>}
                                                </div>
                                            ))}
                                            {order.specialRequests && (
                                                <div className="text-xs text-orange-600 mt-1 font-medium">
                                                    Note: {order.specialRequests}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">₹{order.totalAmount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <div className={`text-sm px-2 py-1 rounded inline-block capitalize
                                            ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                                    order.status === 'preparing' ? 'bg-purple-100 text-purple-700' :
                                                        order.status === 'ready' ? 'bg-indigo-100 text-indigo-700' :
                                                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                                'bg-red-100 text-red-700'
                                            }`}>
                                            {order.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                        <br />
                                        {new Date(order.createdAt).toLocaleTimeString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-2">
                                            {order.status === 'pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order._id, 'confirmed')}
                                                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100"
                                                >
                                                    Confirm
                                                </button>
                                            )}
                                            {order.status === 'confirmed' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order._id, 'preparing')}
                                                    className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded hover:bg-purple-100"
                                                >
                                                    Start Preparing
                                                </button>
                                            )}
                                            {order.status === 'preparing' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order._id, 'ready')}
                                                    className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100"
                                                >
                                                    Mark Ready
                                                </button>
                                            )}
                                            {order.status === 'ready' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order._id, 'delivered')}
                                                    className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100"
                                                >
                                                    Mark Delivered
                                                </button>
                                            )}
                                            {['pending', 'confirmed'].includes(order.status) && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                                                    className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(order._id)}
                                                className="text-xs text-gray-400 hover:text-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {data?.orders?.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                        No orders found matching your criteria.
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

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={`Update Status to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`}
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                        Please enter the estimated preparation time for this order.
                    </p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estimated Time (minutes)
                        </label>
                        <input
                            type="number"
                            min="1"
                            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={estimatedTime}
                            onChange={(e) => setEstimatedTime(e.target.value)}
                            placeholder="e.g. 30"
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            onClick={closeModal}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmStatusUpdate}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Confirm Update
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}
