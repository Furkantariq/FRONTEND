import { useParams } from 'react-router-dom'
import Loading from '../../components/Loading'
import { useBooking } from '../../api/bookings'

export default function BookingDetailPage() {
  const { id = '' } = useParams()
  const { data: booking, isLoading, error } = useBooking(id)

  if (isLoading) return <Loading />
  if (error || !booking) return <div className="container-default py-10">Booking not found.</div>

  return (
    <div className="container-default py-10">
      <h2 className="text-2xl font-semibold mb-4">Booking Details</h2>
      <div className="space-y-2 text-sm">
        <div><span className="text-gray-600">Room:</span> {booking.roomId?.type} • #{booking.roomId?.roomNumber}</div>
        <div><span className="text-gray-600">Dates:</span> {new Date(booking.checkInDate).toDateString()} → {new Date(booking.checkOutDate).toDateString()}</div>
        <div><span className="text-gray-600">Status:</span> {booking.status}</div>
        <div><span className="text-gray-600">Payment:</span> {booking.paymentStatus}</div>
        <div><span className="text-gray-600">Guests:</span> {booking.guests?.length}</div>
        <div><span className="text-gray-600">Total:</span> ${booking.totalAmount}</div>
      </div>
    </div>
  )
}


