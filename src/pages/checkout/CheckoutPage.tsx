import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserCheckoutSessions, completeCheckout, CheckoutSession } from '../../api/checkout'
import Loading from '../../components/Loading'
import { CreditCard, Calendar, CheckCircle, AlertCircle, Receipt, Hotel, Utensils, Car, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CheckoutPage() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card')
    const [notes, setNotes] = useState('')

    const { data, isLoading, error } = useQuery({
        queryKey: ['checkout-sessions'],
        queryFn: getUserCheckoutSessions
    })

    const checkoutMutation = useMutation({
        mutationFn: completeCheckout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['checkout-sessions'] })
            alert('Checkout completed successfully! Thank you for staying with us.')
            navigate('/dashboard')
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || 'Failed to complete checkout')
        }
    })

    const handleCheckout = (checkoutId: string) => {
        if (confirm('Are you sure you want to complete checkout and pay the total amount?')) {
            checkoutMutation.mutate({
                checkoutId,
                paymentMethod: selectedPaymentMethod,
                notes
            })
        }
    }

    if (isLoading) return <Loading />
    if (error) return <div className="container-default py-10 text-red-500">Failed to load checkout information</div>

    const sessions = data?.sessions || []
    // Show both active (currently ongoing) and upcoming (future) sessions
    const activeSession = sessions.find((s: CheckoutSession) => s.status === 'active')

    return (
        <div className="container-default py-10">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-green-100 rounded-xl">
                    <Receipt className="w-8 h-8 text-green-600" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Checkout & Payment</h2>
                    <p className="text-gray-500">Review your stay expenses and settle your bill</p>
                </div>
            </div>

            {!activeSession ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Checkout Session</h3>
                    <p className="text-gray-500 mb-6">You don't have any active stays pending checkout at the moment.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Invoice Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-gray-900">Invoice Details</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(activeSession.checkInDate).toLocaleDateString()} - {new Date(activeSession.checkOutDate).toLocaleDateString()} ({activeSession.numberOfNights} nights)
                                    </p>
                                </div>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase">
                                    {activeSession.status}
                                </span>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {activeSession.services.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">No services found for this stay.</div>
                                ) : (
                                    activeSession.services.map((item: any, index: number) => (
                                        <div key={index} className="p-4 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                                            <div className={`p-2 rounded-lg flex-shrink-0 ${item.type === 'room' ? 'bg-blue-50 text-blue-600' :
                                                item.type === 'food' ? 'bg-orange-50 text-orange-600' :
                                                    item.type === 'car' ? 'bg-purple-50 text-purple-600' :
                                                        'bg-pink-50 text-pink-600'
                                                }`}>
                                                {item.type === 'room' && <Hotel className="w-5 h-5" />}
                                                {item.type === 'food' && <Utensils className="w-5 h-5" />}
                                                {item.type === 'car' && <Car className="w-5 h-5" />}
                                                {item.type === 'custom_food' && <Star className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-medium text-gray-900">{item.description}</h4>
                                                    <span className="font-bold text-gray-900">₹{item.amount.toFixed(2)}</span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {new Date(item.addedAt).toLocaleDateString()} • {item.type.replace('_', ' ').toUpperCase()}
                                                </p>
                                                {item.details && (
                                                    <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                                        {item.type === 'room' && `Room ${item.details.roomNumber} (${item.details.roomType})`}
                                                        {item.type === 'food' && `${item.details.items.length} items ordered`}
                                                        {item.type === 'car' && `${item.details.carBrand} ${item.details.carModel}`}
                                                        {item.type === 'custom_food' && `Request: ${item.details.requestTitle}`}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Payment Summary</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{activeSession.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Taxes & Fees</span>
                                    <span>₹{activeSession.taxes.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
                                    <span>Total Due</span>
                                    <span>₹{activeSession.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                                    <select
                                        className="w-full border rounded-lg px-3 py-2"
                                        value={selectedPaymentMethod}
                                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                    >
                                        <option value="card">Credit/Debit Card</option>
                                        <option value="cash">Cash (at Counter)</option>
                                        <option value="transfer">Bank Transfer</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                                    <textarea
                                        className="w-full border rounded-lg px-3 py-2 h-20 text-sm"
                                        placeholder="Any special instructions..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </div>

                                <button
                                    onClick={() => handleCheckout(activeSession._id)}
                                    disabled={checkoutMutation.isPending}
                                    className="w-full py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {checkoutMutation.isPending ? (
                                        'Processing...'
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" /> Pay & Checkout
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-center text-gray-500 mt-4">
                                    By clicking "Pay & Checkout", you agree to settle the total amount for your stay and services.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
