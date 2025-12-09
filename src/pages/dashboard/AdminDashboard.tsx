import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../api/client'
import Loading from '../../components/Loading'
import {
  Users,
  Calendar,
  Car,
  Utensils,
  CheckCircle,
  Activity,
  CreditCard,
  ArrowRight
} from 'lucide-react'

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const [usersRes, bookingsRes, carsRes, diningRes] = await Promise.all([
        api.get('/users/stats/overview'),
        api.get('/admin/bookings/stats'),
        api.get('/cars/analytics'),
        api.get('/food-orders/admin/orders/analytics')
      ])
      return {
        users: usersRes.data?.stats,
        bookings: bookingsRes.data?.stats,
        cars: carsRes.data?.analytics,
        dining: diningRes.data?.analytics
      }
    }
  })

  const { data: pendingBookings } = useQuery({
    queryKey: ['admin', 'pending-bookings'],
    queryFn: async () => {
      const res = await api.get('/admin/bookings?status=pending&limit=5')
      return res.data?.bookings || []
    }
  })

  if (isLoading) return <Loading />

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.users?.totalUsers || 0,
      subtext: `${stats?.users?.activeUsers || 0} active users`,
      icon: Users,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      link: '/admin/users'
    },
    {
      title: 'Total Bookings',
      value: stats?.bookings?.totalBookings || 0,
      subtext: `${stats?.bookings?.pendingBookings || 0} pending approval`,
      icon: Calendar,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600',
      link: '/admin/bookings'
    },
    {
      title: 'Car Rentals',
      value: stats?.cars?.priceAnalysis?.totalCars || 0,
      subtext: `${stats?.cars?.availabilityAnalysis?.find((a: any) => a._id === true)?.count || 0} available now`,
      icon: Car,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      link: '/admin/cars' // Note: This page might need to be created if not exists
    },
    {
      title: 'Food Orders',
      value: stats?.dining?.totalOrders || 0,
      subtext: `${stats?.dining?.statusDistribution?.pending || 0} pending orders`,
      icon: Utensils,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      link: '/admin/orders'
    }
  ]

  return (
    <div className="container-default py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-500 mt-1">Overview of your hotel management system</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            System Online
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${card.lightColor}`}>
                <card.icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
              {card.link && (
                <Link to={card.link} className="text-gray-400 hover:text-gray-600">
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{card.title}</h3>
            <div className="text-3xl font-bold text-gray-900 mb-1">{card.value}</div>
            <div className="text-sm text-gray-500">{card.subtext}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/admin/users" className="group p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                  <span className="font-semibold text-gray-900 group-hover:text-blue-700">User Management</span>
                </div>
                <p className="text-sm text-gray-500">Manage user accounts, roles, and permissions</p>
              </Link>

              <Link to="/admin/rooms" className="group p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                  <span className="font-semibold text-gray-900 group-hover:text-blue-700">Room Management</span>
                </div>
                <p className="text-sm text-gray-500">Update room status, prices, and availability</p>
              </Link>

              <Link to="/admin/bookings" className="group p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                  <span className="font-semibold text-gray-900 group-hover:text-blue-700">Booking Management</span>
                </div>
                <p className="text-sm text-gray-500">Review pending bookings and manage reservations</p>
              </Link>

              <Link to="/admin/orders" className="group p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <Utensils className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                  <span className="font-semibold text-gray-900 group-hover:text-blue-700">Order Management</span>
                </div>
                <p className="text-sm text-gray-500">Manage food orders and custom requests</p>
              </Link>

              <Link to="/admin/dining" className="group p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <Utensils className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                  <span className="font-semibold text-gray-900 group-hover:text-blue-700">Menu Management</span>
                </div>
                <p className="text-sm text-gray-500">Manage restaurant menu items and availability</p>
              </Link>

              <Link to="/admin/cars" className="group p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <Car className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                  <span className="font-semibold text-gray-900 group-hover:text-blue-700">Car Management</span>
                </div>
                <p className="text-sm text-gray-500">Manage fleet vehicles and availability</p>
              </Link>

              <Link to="/admin/settings" className="group p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
                  <span className="font-semibold text-gray-900 group-hover:text-blue-700">Site Settings</span>
                </div>
                <p className="text-sm text-gray-500">Manage hotel name, contact info, and socials</p>
              </Link>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Pending Bookings Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Pending Bookings</h3>
              <Link to="/admin/bookings?status=pending" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {pendingBookings && pendingBookings.length > 0 ? (
              <div className="space-y-3">
                {pendingBookings.map((booking: any) => (
                  <Link
                    key={booking._id}
                    to="/admin/bookings"
                    className="block p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="font-medium text-sm text-gray-900">
                        {booking.roomId?.type} Room #{booking.roomId?.roomNumber}
                      </div>
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                        Pending
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Guest: {booking.userId?.firstName} {booking.userId?.lastName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 text-sm">
                No pending bookings at the moment
              </div>
            )}
          </div>

          {/* System Status Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Activity className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">Database</div>
                    <div className="text-xs text-green-600">Connected</div>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">API Status</div>
                    <div className="text-xs text-green-600">Operational</div>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CreditCard className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">Payment Gateway</div>
                    <div className="text-xs text-green-600">Active</div>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
