import { Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import GoogleCallbackPage from './pages/auth/GoogleCallbackPage'
import ProfilePage from './pages/ProfilePage'
import { ProtectedRoute } from './auth/ProtectedRoute'
import RoomsListPage from './pages/rooms/RoomsListPage'
import RoomDetailPage from './pages/rooms/RoomDetailPage'
import MyBookingsPage from './pages/bookings/MyBookingsPage'
import BookingDetailPage from './pages/bookings/BookingDetailPage'
import MenuPage from './pages/dining/MenuPage'
import MyOrdersPage from './pages/dining/MyOrdersPage'
import CustomFoodRequestPage from './pages/dining/CustomFoodRequestPage'
import CheckoutPage from './pages/checkout/CheckoutPage'
import CarsPage from './pages/cars/CarsPage'
import UserDashboard from './pages/dashboard/UserDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import AdminRoomsPage from './pages/admin/AdminRoomsPage'
import AdminBookingsPage from './pages/admin/AdminBookingsPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminDiningPage from './pages/admin/AdminDiningPage'
import AdminOrderManagementPage from './pages/admin/AdminOrderManagementPage'

import AdminCarsPage from './pages/admin/AdminCarsPage'
import AdminBannersPage from './pages/admin/AdminBannersPage'
import AdminCheckoutPage from './pages/admin/AdminCheckoutPage'
import SiteSettingsPage from './pages/admin/SiteSettingsPage'
import { useAuth } from './auth/useAuth'

function DashboardRoute() {
  const { user } = useAuth()
  return user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsListPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/dining" element={<MenuPage />} />
          <Route path="/cars" element={<CarsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<GoogleCallbackPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRoute />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings/:id"
            element={
              <ProtectedRoute>
                <BookingDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/custom-food-requests"
            element={
              <ProtectedRoute>
                <CustomFoodRequestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/rooms"
            element={
              <ProtectedRoute>
                <AdminRoomsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoute>
                <AdminBookingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dining"
            element={
              <ProtectedRoute>
                <AdminDiningPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <AdminOrderManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/cars"
            element={
              <ProtectedRoute>
                <AdminCarsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/checkout"
            element={
              <ProtectedRoute>
                <AdminCheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/banners"
            element={
              <ProtectedRoute>
                <AdminBannersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <SiteSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}


