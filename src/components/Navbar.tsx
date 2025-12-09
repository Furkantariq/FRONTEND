import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { ChevronDown } from 'lucide-react'
import { usePendingBookingsCount, usePendingOrdersCount } from '../api/admin'

import { useSiteSettings } from '../api/settings'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isManagementDropdownOpen, setIsManagementDropdownOpen] = useState(false)

  const { data: settings } = useSiteSettings()
  const brandName = settings?.brand?.name || 'Hotel Portal'

  // Fetch pending counts for admin badges (only if user is admin)
  const { data: pendingBookings = 0 } = usePendingBookingsCount()
  const { data: pendingOrdersData } = usePendingOrdersCount()

  const pendingOrders = typeof pendingOrdersData === 'number' ? pendingOrdersData : (pendingOrdersData?.total || 0)

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="container-default flex items-center justify-between py-3">
        <Link to="/" className="text-xl font-semibold text-brand">{brandName}</Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 text-sm">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-brand' : 'text-gray-700'}>Home</NavLink>
          {user ? (
            <>
              {user.role === 'admin' ? (
                <>
                  <NavLink to="/admin" className={({ isActive }) => isActive ? 'text-brand' : 'text-gray-700'}>Dashboard</NavLink>

                  {/* Management Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsManagementDropdownOpen(!isManagementDropdownOpen)}
                      onBlur={() => setTimeout(() => setIsManagementDropdownOpen(false), 200)}
                      className="flex items-center gap-1 text-gray-700 hover:text-brand transition-colors"
                    >
                      Management
                      <ChevronDown className={`w-4 h-4 transition-transform ${isManagementDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isManagementDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg py-2 min-w-[150px] z-50">
                        <NavLink
                          to="/admin/rooms"
                          className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? 'text-brand bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
                          onClick={() => setIsManagementDropdownOpen(false)}
                        >
                          Rooms
                        </NavLink>
                        <NavLink
                          to="/admin/dining"
                          className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? 'text-brand bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
                          onClick={() => setIsManagementDropdownOpen(false)}
                        >
                          Dining
                        </NavLink>
                        <NavLink
                          to="/admin/cars"
                          className={({ isActive }) => `block px-4 py-2 text-sm ${isActive ? 'text-brand bg-blue-50' : 'text-gray-700 hover:bg-gray-50'}`}
                          onClick={() => setIsManagementDropdownOpen(false)}
                        >
                          Cars
                        </NavLink>
                      </div>
                    )}
                  </div>

                  <NavLink to="/admin/bookings" className={({ isActive }) => isActive ? 'text-brand' : 'text-gray-700'}>
                    <span className="relative inline-flex items-center">
                      Bookings
                      {pendingBookings > 0 && (
                        <span className="absolute -top-2 -right-5 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                          {pendingBookings > 99 ? '99+' : pendingBookings}
                        </span>
                      )}
                    </span>
                  </NavLink>
                  <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'text-brand' : 'text-gray-700'}>
                    <span className="relative inline-flex items-center">
                      Orders
                      {pendingOrders > 0 && (
                        <span className="absolute -top-2 -right-5 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                          {pendingOrders > 99 ? '99+' : pendingOrders}
                        </span>
                      )}
                    </span>
                  </NavLink>
                  <NavLink to="/admin/checkout" className={({ isActive }) => isActive ? 'text-brand' : 'text-gray-700'}>Checkout</NavLink>
                  <NavLink to="/admin/banners" className={({ isActive }) => isActive ? 'text-brand' : 'text-gray-700'}>Banners</NavLink>
                  <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'text-brand' : 'text-gray-700'}>Users</NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-brand' : 'text-gray-700'}>Dashboard</NavLink>
                  <NavLink to="/rooms" className={({ isActive }) => isActive ? 'text-brand' : 'text-gray-700'}>Rooms</NavLink>
                  <NavLink to="/dining" className={({ isActive }) => isActive ? 'text-brand' : 'text-gray-700'}>Dining</NavLink>
                  <NavLink to="/custom-food-requests" className={({ isActive }) => isActive ? 'text-brand' : 'text-gray-700'}>Custom Requests</NavLink>
                  <NavLink to="/orders" className={({ isActive }) => isActive ? 'text-brand' : 'text-gray-700'}>My Orders</NavLink>
                  <NavLink to="/bookings" className={({ isActive }) => isActive ? 'text-brand' : 'text-gray-700'}>My Bookings</NavLink>
                  <NavLink to="/cars" className={({ isActive }) => isActive ? 'text-brand' : 'text-gray-700'}>Cars</NavLink>
                  <NavLink to="/checkout" className={({ isActive }) => isActive ? 'text-brand' : 'text-gray-700'}>Checkout</NavLink>
                </>
              )}
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'text-brand' : 'text-gray-700'}>Profile</NavLink>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
              >Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'text-brand' : 'text-gray-700'}>Login</NavLink>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div >

      {/* Mobile Navigation */}
      {
        isMobileMenuOpen && (
          <nav className="md:hidden border-t bg-white">
            <div className="container-default py-4 flex flex-col gap-3">
              <NavLink
                to="/"
                onClick={closeMobileMenu}
                className={({ isActive }) => `py-2 ${isActive ? 'text-brand font-medium' : 'text-gray-700'}`}
              >
                Home
              </NavLink>
              {user ? (
                <>
                  {user.role === 'admin' ? (
                    <>
                      <NavLink
                        to="/admin"
                        onClick={closeMobileMenu}
                        className={({ isActive }) => `py-2 ${isActive ? 'text-brand font-medium' : 'text-gray-700'}`}
                      >
                        Admin Dashboard
                      </NavLink>

                      {/* Management Section */}
                      <div className="py-2">
                        <button
                          onClick={() => setIsManagementDropdownOpen(!isManagementDropdownOpen)}
                          className="flex items-center justify-between w-full text-gray-700 font-medium"
                        >
                          Management
                          <ChevronDown className={`w-4 h-4 transition-transform ${isManagementDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isManagementDropdownOpen && (
                          <div className="pl-4 mt-2 space-y-2">
                            <NavLink
                              to="/admin/rooms"
                              onClick={closeMobileMenu}
                              className={({ isActive }) => `block py-2 ${isActive ? 'text-brand font-medium' : 'text-gray-600'}`}
                            >
                              Rooms
                            </NavLink>
                            <NavLink
                              to="/admin/dining"
                              onClick={closeMobileMenu}
                              className={({ isActive }) => `block py-2 ${isActive ? 'text-brand font-medium' : 'text-gray-600'}`}
                            >
                              Dining Menu
                            </NavLink>
                            <NavLink
                              to="/admin/cars"
                              onClick={closeMobileMenu}
                              className={({ isActive }) => `block py-2 ${isActive ? 'text-brand font-medium' : 'text-gray-600'}`}
                            >
                              Cars
                            </NavLink>
                          </div>
                        )}
                      </div>

                      <NavLink
                        to="/admin/bookings"
                        onClick={closeMobileMenu}
                        className={({ isActive }) => `py-2 flex items-center gap-2 ${isActive ? 'text-brand font-medium' : 'text-gray-700'}`}
                      >
                        Bookings
                        {pendingBookings > 0 && (
                          <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                            {pendingBookings > 99 ? '99+' : pendingBookings}
                          </span>
                        )}
                      </NavLink>
                      <NavLink
                        to="/admin/orders"
                        onClick={closeMobileMenu}
                        className={({ isActive }) => `py-2 flex items-center gap-2 ${isActive ? 'text-brand font-medium' : 'text-gray-700'}`}
                      >
                        Order Management
                        {pendingOrders > 0 && (
                          <span className="flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                            {pendingOrders > 99 ? '99+' : pendingOrders}
                          </span>
                        )}
                      </NavLink>
                      <NavLink
                        to="/admin/checkout"
                        onClick={closeMobileMenu}
                        className={({ isActive }) => `py-2 ${isActive ? 'text-brand font-medium' : 'text-gray-700'}`}
                      >
                        Checkout
                      </NavLink>
                      <NavLink
                        to="/admin/banners"
                        onClick={closeMobileMenu}
                        className={({ isActive }) => `py-2 ${isActive ? 'text-brand font-medium' : 'text-gray-700'}`}
                      >
                        Banners
                      </NavLink>
                      <NavLink
                        to="/admin/users"
                        onClick={closeMobileMenu}
                        className={({ isActive }) => `py-2 ${isActive ? 'text-brand font-medium' : 'text-gray-700'}`}
                      >
                        Users
                      </NavLink>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to="/dashboard"
                        onClick={closeMobileMenu}
                        className={({ isActive }) => `py-2 ${isActive ? 'text-brand font-medium' : 'text-gray-700'}`}
                      >
                        Dashboard
                      </NavLink>
                      <NavLink
                        to="/orders"
                        onClick={closeMobileMenu}
                        className={({ isActive }) => `py-2 ${isActive ? 'text-brand font-medium' : 'text-gray-700'}`}
                      >
                        My Orders
                      </NavLink>
                      <NavLink
                        to="/bookings"
                        onClick={closeMobileMenu}
                        className={({ isActive }) => `py-2 ${isActive ? 'text-brand font-medium' : 'text-gray-700'}`}
                      >
                        My Bookings
                      </NavLink>
                    </>
                  )}
                  {user.role !== 'admin' && (
                    <>
                      <NavLink
                        to="/rooms"
                        onClick={closeMobileMenu}
                        className={({ isActive }) => `py-2 ${isActive ? 'text-brand font-medium' : 'text-gray-700'}`}
                      >
                        Rooms
                      </NavLink>
                      <NavLink
                        to="/dining"
                        onClick={closeMobileMenu}
                        className={({ isActive }) => `py-2 ${isActive ? 'text-brand font-medium' : 'text-gray-700'}`}
                      >
                        Dining
                      </NavLink>
                      <NavLink
                        to="/custom-food-requests"
                        onClick={closeMobileMenu}
                        className={({ isActive }) => `py-2 ${isActive ? 'text-brand font-medium' : 'text-gray-700'}`}
                      >
                        Custom Requests
                      </NavLink>
                      <NavLink
                        to="/cars"
                        onClick={closeMobileMenu}
                        className={({ isActive }) => `py-2 ${isActive ? 'text-brand font-medium' : 'text-gray-700'}`}
                      >
                        Cars
                      </NavLink>
                      <NavLink
                        to="/checkout"
                        onClick={closeMobileMenu}
                        className={({ isActive }) => `py-2 ${isActive ? 'text-brand font-medium' : 'text-gray-700'}`}
                      >
                        Checkout
                      </NavLink>
                    </>
                  )}
                  <NavLink
                    to="/profile"
                    onClick={closeMobileMenu}
                    className={({ isActive }) => `py-2 ${isActive ? 'text-brand font-medium' : 'text-gray-700'}`}
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="py-2 text-left text-gray-700 hover:text-brand"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    onClick={closeMobileMenu}
                    className={({ isActive }) => `py-2 ${isActive ? 'text-brand font-medium' : 'text-gray-700'}`}
                  >
                    Login
                  </NavLink>
                </>
              )}
            </div>
          </nav>
        )
      }
    </header >
  )
}
