import { useState } from 'react'
import AdminOrdersPage from './AdminOrdersPage'
import AdminCustomRequestsPage from './AdminCustomRequestsPage'
import { usePendingOrdersCount } from '../../api/admin'

export default function AdminOrderManagementPage() {
    const [activeTab, setActiveTab] = useState<'orders' | 'custom-requests'>('orders')
    const { data: pendingCounts } = usePendingOrdersCount()

    const foodCount = pendingCounts?.foodCount || 0
    const customCount = pendingCounts?.customCount || 0

    return (
        <div className="container-default py-8">
            {/* Tab Navigation */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Order Management</h1>
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex gap-4">
                        <button
                            onClick={() => setActiveTab('custom-requests')}
                            className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'custom-requests'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Custom Requests
                            {customCount > 0 && (
                                <span className="flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full">
                                    {customCount > 99 ? '99+' : customCount}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`py-3 px-4 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab === 'orders'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            Food Orders
                            {foodCount > 0 && (
                                <span className="flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full">
                                    {foodCount > 99 ? '99+' : foodCount}
                                </span>
                            )}
                        </button>
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            <div>
                {activeTab === 'orders' && <AdminOrdersPage />}
                {activeTab === 'custom-requests' && <AdminCustomRequestsPage />}
            </div>
        </div>
    )
}
