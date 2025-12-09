import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyFoodOrders, cancelFoodOrder } from '../../api/food-orders'
import Loading from '../../components/Loading'
import { getFirstImage } from '../../utils/imageUrl'

export default function MyOrdersPage() {
    const queryClient = useQueryClient()
    const { data: orders, isLoading, error } = useQuery({
        queryKey: ['my-food-orders'],
        queryFn: getMyFoodOrders
    })

    const cancelMutation = useMutation({
        mutationFn: cancelFoodOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-food-orders'] })
            alert('Order cancelled successfully')
        },
        onError: (error: any) => {
            alert(error.response?.data?.message || 'Failed to cancel order')
        }
    })

    const handleCancel = (orderId: string) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            cancelMutation.mutate(orderId)
        }
    }

    if (isLoading) return <Loading />
    if (error) return <div className="container-default py-10">Failed to load orders.</div>

    return (
        <div className="container-default py-10">
            <h2 className="text-2xl font-semibold mb-6">My Food Orders</h2>

            {orders?.orders?.length === 0 ? (
                <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-lg">
                    <p>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders?.orders?.map((order: any) => (
                        <div key={order._id} className="bg-white border rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center flex-wrap gap-4">
                                <div>
                                    <span className="text-sm text-gray-500 block">Order ID</span>
                                    <span className="font-mono font-medium text-sm">#{order._id.slice(-6)}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 block">Date</span>
                                    <span className="font-medium text-sm">
                                        {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 block">Status</span>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold capitalize
                                        ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                        ${order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : ''}
                                        ${order.status === 'preparing' ? 'bg-purple-100 text-purple-800' : ''}
                                        ${order.status === 'ready' ? 'bg-indigo-100 text-indigo-800' : ''}
                                        ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                                        ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                                    `}>
                                        {order.status}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-500 block">Total</span>
                                    <span className="font-bold text-brand">${order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.items.map((item: any, index: number) => (
                                        <div key={index} className="flex items-start gap-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                {item.menuItemId?.images?.length > 0 ? (
                                                    <img src={getFirstImage(item.menuItemId.images)} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Img</div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <h4 className="font-medium">{item.name}</h4>
                                                    <span className="text-gray-600">x{item.quantity}</span>
                                                </div>
                                                <p className="text-sm text-gray-500">${item.price} each</p>
                                                {item.specialInstructions && (
                                                    <p className="text-xs text-gray-500 mt-1 italic">Note: {item.specialInstructions}</p>
                                                )}
                                            </div>
                                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 pt-4 border-t flex justify-between items-center text-sm text-gray-600">
                                    <div>
                                        <span className="font-medium">Type:</span> <span className="capitalize">{order.orderType}</span>
                                        {order.tableNumber && <span className="ml-4"><span className="font-medium">Table:</span> {order.tableNumber}</span>}
                                        {order.roomNumber && <span className="ml-4"><span className="font-medium">Room:</span> {order.roomNumber}</span>}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {order.estimatedTime && (
                                            <div>
                                                <span className="font-medium">Est. Time:</span> {order.estimatedTime} mins
                                            </div>
                                        )}
                                        {['pending', 'confirmed'].includes(order.status) && (
                                            <button
                                                onClick={() => handleCancel(order._id)}
                                                className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
