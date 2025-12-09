import { useState } from 'react'
import { useAdminBookings, useAcceptBooking, useRejectBooking, useCompleteBooking } from '../../api/admin'
import Loading from '../../components/Loading'

export default function AdminBookingsPage() {
  const [filters, setFilters] = useState<{ status?: string; page?: number; limit?: number }>({})
  const { data, isLoading, error } = useAdminBookings(filters)
  const acceptBooking = useAcceptBooking()
  const rejectBooking = useRejectBooking()
  const completeBooking = useCompleteBooking()

  if (isLoading) return <Loading />
  if (error) return <div className="container-default py-10">Failed to load bookings.</div>

  const handleAccept = async (bookingId: string) => {
    try {
      await acceptBooking.mutateAsync({ bookingId })
      alert('Booking accepted successfully!')
    } catch (error) {
      console.error('Failed to accept booking:', error)
      alert('Failed to accept booking')
    }
  }

  const handleReject = async (bookingId: string) => {
    const reason = prompt('Please provide a reason for rejection:')
    if (!reason || reason.trim() === '') {
      alert('Rejection reason is required')
      return
    }
    try {
      await rejectBooking.mutateAsync({ bookingId, reason })
      alert('Booking rejected successfully!')
    } catch (error) {
      console.error('Failed to reject booking:', error)
      alert('Failed to reject booking')
    }
  }

  const handleComplete = async (bookingId: string) => {
    if (confirm('Check out this guest? This will mark the booking as completed and set the room to cleaning status.')) {
      try {
        await completeBooking.mutateAsync(bookingId)
        alert('Guest checked out successfully! Room has been set to cleaning status.')
      } catch (error) {
        console.error('Failed to complete booking:', error)
        alert('Failed to check out guest')
      }
    }
  }

  return (
    <div className="container-default py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Booking Management</h2>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <select
          value={filters.status || ''}
          onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
          className="border rounded px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {data?.bookings && data.bookings.length > 0 ? (
          data.bookings.map((booking: any) => (
            <div key={booking._id} className="border rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Booking Details</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Room: {booking.roomId?.type} #{booking.roomId?.roomNumber}</div>
                    <div>Guest: {booking.userId?.firstName} {booking.userId?.lastName}</div>
                    <div>Email: {booking.userId?.email}</div>
                    <div>Guests: {booking.numberOfGuests}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Dates & Amount</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Check-in: {new Date(booking.checkInDate).toDateString()}</div>
                    <div>Check-out: {new Date(booking.checkOutDate).toDateString()}</div>
                    <div>Nights: {booking.numberOfNights}</div>
                    <div className="font-semibold">Total: ₹{booking.totalAmount}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Status & Actions</h3>
                  <div className="space-y-2">
                    <div className={`text-sm px-2 py-1 rounded inline-block ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          booking.status === 'cancelled' ? 'bg-gray-100 text-gray-700' :
                            'bg-blue-100 text-blue-700'
                      }`}>
                      {booking.status}
                    </div>
                    <div className="text-xs text-gray-500">
                      Payment: {booking.paymentStatus}
                    </div>

                    {booking.status === 'pending' && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleAccept(booking._id)}
                          className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(booking._id)}
                          className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleComplete(booking._id)}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                      >
                        Check Out Guest
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {booking.specialRequests && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <div className="text-sm font-medium text-gray-700">Special Requests:</div>
                  <div className="text-sm text-gray-600">{booking.specialRequests}</div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-gray-400 mb-2">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings found</h3>
            <p className="text-gray-500">
              {filters.status
                ? `No ${filters.status} bookings at the moment.`
                : 'There are no bookings yet. Bookings will appear here once users make reservations.'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data?.pagination && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
            disabled={!data.pagination.hasPrevPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {data.pagination.currentPage} of {data.pagination.totalPages}
          </span>
          <button
            onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
            disabled={!data.pagination.hasNextPage}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
