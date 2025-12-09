import { Link } from 'react-router-dom'
import { useMyBookings } from '../../api/bookings'
import { useMyFoodOrders } from '../../api/dining'
import { useMyCarRequests } from '../../api/cars'
import Loading from '../../components/Loading'
import {
  Calendar,
  Utensils,
  Car,
  ArrowRight,
  MapPin,
  CreditCard
} from 'lucide-react'

export default function UserDashboard() {
  const { data: bookings, isLoading: bookingsLoading } = useMyBookings()
  const { data: foodOrders, isLoading: foodOrdersLoading } = useMyFoodOrders()
  const { data: carRequests, isLoading: carRequestsLoading } = useMyCarRequests()

  if (bookingsLoading || foodOrdersLoading || carRequestsLoading) return <Loading />

  const upcomingBookings = bookings?.filter((b: any) => b.status === 'confirmed' || b.status === 'pending') || []
  const activeFoodOrders = foodOrders?.filter((o: any) => o.status === 'pending' || o.status === 'preparing') || []
  const activeCarRequests = carRequests?.filter((r: any) => r.status === 'pending' || r.status === 'active') || []

  return (
    <div className="container-default py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
          <p className="text-gray-500 mt-1">Here's what's happening with your stay</p>
        </div>
        <Link to="/rooms" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Book a Room
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">

          {/* Upcoming Bookings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900">Upcoming Stays</h3>
              </div>
              <Link to="/bookings" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-6">
              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.slice(0, 2).map((booking: any) => (
                    <div key={booking._id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-xl hover:border-blue-100 transition-colors">
                      <div className="w-full sm:w-32 h-24 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={booking.roomId?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                          alt="Room"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-900">{booking.roomId?.type || 'Luxury Room'}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                              <MapPin className="w-4 h-4" />
                              <span>Room {booking.roomId?.roomNumber}</span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span>₹{booking.totalAmount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-gray-900 font-medium mb-1">No upcoming bookings</h4>
                  <p className="text-gray-500 text-sm mb-4">Ready to plan your next getaway?</p>
                  <Link to="/rooms" className="text-blue-600 font-medium hover:underline">Browse Rooms</Link>
                </div>
              )}
            </div>
          </div>

          {/* Active Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Food Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Utensils className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Dining</h3>
                </div>
                <Link to="/dining" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Order</Link>
              </div>

              {activeFoodOrders.length > 0 ? (
                <div className="space-y-3">
                  {activeFoodOrders.slice(0, 2).map((order: any) => (
                    <div key={order._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Order #{order._id.slice(-4)}</div>
                        <div className="text-xs text-gray-500">{order.items?.length || 0} items • ₹{order.totalAmount}</div>
                      </div>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-md font-medium">
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm">No active food orders</p>
                </div>
              )}
            </div>

            {/* Car Rentals */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Car className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Transport</h3>
                </div>
                <Link to="/cars" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Rent</Link>
              </div>

              {activeCarRequests.length > 0 ? (
                <div className="space-y-3">
                  {activeCarRequests.slice(0, 2).map((request: any) => (
                    <div key={request._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Rental Request</div>
                        <div className="text-xs text-gray-500">
                          {new Date(request.startDate).toLocaleDateString()}
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md font-medium">
                        {request.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 text-sm">No active car rentals</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-bold mb-2">Need Help?</h3>
            <p className="text-blue-100 text-sm mb-6">Our concierge service is available 24/7 to assist you with any requests.</p>
            <button className="w-full py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              Contact Concierge
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/profile" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                <span className="text-gray-600 group-hover:text-gray-900">My Profile</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </Link>
              <Link to="/dining" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                <span className="text-gray-600 group-hover:text-gray-900">Restaurant Menu</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </Link>
              <Link to="/custom-food-requests" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                <span className="text-gray-600 group-hover:text-gray-900">Custom Food Requests</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </Link>
              <Link to="/cars" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                <span className="text-gray-600 group-hover:text-gray-900">Car Fleet</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
