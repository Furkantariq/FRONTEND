import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { createFoodOrder } from '../../api/food-orders'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Modal from '../Modal'

interface CartDrawerProps {
    isOpen: boolean
    onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart()
    const navigate = useNavigate()
    const [orderType, setOrderType] = useState<'dine-in' | 'takeaway' | 'delivery'>('dine-in')
    const [tableNumber, setTableNumber] = useState('')
    const [roomNumber, setRoomNumber] = useState('')
    const [specialRequests, setSpecialRequests] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const createOrderMutation = useMutation({
        mutationFn: createFoodOrder,
        onSuccess: () => {
            alert('Order placed successfully!')
            clearCart()
            onClose()
            // navigate('/orders') // TODO: Create orders page
        },
        onError: (error: any) => {
            setErrorMessage(error.response?.data?.error || error.response?.data?.message || 'Failed to place order')
            setIsErrorModalOpen(true)
        }
    })

    const handleCheckout = async () => {
        if (items.length === 0) return

        if (orderType === 'dine-in' && !tableNumber) {
            alert('Please enter a table number')
            return
        }

        setIsSubmitting(true)
        try {
            await createOrderMutation.mutateAsync({
                items: items.map(item => ({
                    menuItemId: item.menuItemId,
                    quantity: item.quantity,
                    specialInstructions: item.specialInstructions
                })),
                orderType,
                tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
                roomNumber: orderType === 'delivery' ? roomNumber : undefined, // Assuming delivery means room service here
                specialRequests,
                paymentMethod: 'cash' // Default for now
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-xl flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-bold">Your Order</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10">
                            <p>Your cart is empty</p>
                            <button onClick={onClose} className="mt-4 text-brand font-medium">
                                Browse Menu
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map(item => (
                                <div key={item.menuItemId} className="flex gap-3 border-b pb-4">
                                    {item.image && (
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <h3 className="font-medium">{item.name}</h3>
                                            <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center border rounded">
                                                <button
                                                    onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                                                    className="px-2 py-1 hover:bg-gray-100"
                                                >
                                                    -
                                                </button>
                                                <span className="px-2 text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                                                    className="px-2 py-1 hover:bg-gray-100"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.menuItemId)}
                                                className="text-xs text-red-500 hover:text-red-700 underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Order Type</label>
                                    <select
                                        value={orderType}
                                        onChange={(e) => setOrderType(e.target.value as any)}
                                        className="w-full border rounded-lg px-3 py-2"
                                    >
                                        <option value="dine-in">Dine In</option>
                                        <option value="takeaway">Takeaway</option>
                                        <option value="delivery">Room Service / Delivery</option>
                                    </select>
                                </div>

                                {orderType === 'dine-in' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Table Number</label>
                                        <input
                                            type="text"
                                            value={tableNumber}
                                            onChange={(e) => setTableNumber(e.target.value)}
                                            className="w-full border rounded-lg px-3 py-2"
                                            placeholder="Enter table number"
                                        />
                                    </div>
                                )}

                                {orderType === 'delivery' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
                                        <input
                                            type="text"
                                            value={roomNumber}
                                            onChange={(e) => setRoomNumber(e.target.value)}
                                            className="w-full border rounded-lg px-3 py-2"
                                            placeholder="Enter room number"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                                    <textarea
                                        value={specialRequests}
                                        onChange={(e) => setSpecialRequests(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 h-20"
                                        placeholder="Any allergies or special requests?"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-4 border-t bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-lg">Total</span>
                            <span className="font-bold text-xl text-brand">${totalAmount.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={isSubmitting}
                            className="w-full py-3 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark disabled:opacity-50"
                        >
                            {isSubmitting ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isErrorModalOpen}
                onClose={() => setIsErrorModalOpen(false)}
                title="Order Failed"
            >
                <div className="text-red-600">
                    {errorMessage}
                </div>
            </Modal>
        </div >
    )
}
