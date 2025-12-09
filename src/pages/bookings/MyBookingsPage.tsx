import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Loading from '../../components/Loading'
import { useCancelBooking, useMyBookings } from '../../api/bookings'
import { useAuth } from '../../auth/useAuth'

export default function MyBookingsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data, isLoading, error } = useMyBookings()
  const cancelMutation = useCancelBooking()

  // Redirect admins to admin bookings page
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/bookings')
    }
  }, [user, navigate])

  if (isLoading) return <Loading />
  if (error) return <div className="container-default py-10">Failed to load bookings.</div>

  return (
    <div className="container-default py-10">
      <h2 className="text-2xl font-semibold mb-6">My Bookings</h2>
      <div className="space-y-4">
        {data?.length === 0 && <div className="text-gray-600">No bookings yet.</div>}
        {data?.map((b: any) => (
          <div key={b._id} className="border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{b.roomId?.type || 'Room'} • #{b.roomId?.roomNumber}</div>
              <div className="text-sm text-gray-600">{new Date(b.checkInDate).toDateString()} → {new Date(b.checkOutDate).toDateString()}</div>
              <div className="text-sm mt-1">Status: <span className="font-medium">{b.status}</span> • Payment: <span className="font-medium">{b.paymentStatus}</span></div>
            </div>
            <div className="flex items-center gap-2">
              <Link to={`/bookings/${b._id}`} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">Details</Link>
              {b.status !== 'cancelled' && (
                <button
                  onClick={() => cancelMutation.mutate({ id: b._id })}
                  disabled={cancelMutation.isPending}
                  className="px-3 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50"
                >Cancel</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


