import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useRoom } from '../../api/rooms'
import Loading from '../../components/Loading'
import { useCreateBooking } from '../../api/bookings'
import { ImageCarousel } from '../../components/ImageCarousel'
import { useAuth } from '../../auth/useAuth'

export default function RoomDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: room, isLoading, error } = useRoom(id)
  const createBooking = useCreateBooking()
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const dayAfterTomorrow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  const [checkIn, setCheckIn] = useState<string>(tomorrow.toISOString().slice(0, 10))
  const [checkOut, setCheckOut] = useState<string>(dayAfterTomorrow.toISOString().slice(0, 10))
  const [guests, setGuests] = useState<number>(1)

  const handleBooking = () => {
    if (!user) {
      alert('Please login to book a room')
      navigate('/login')
      return
    }

    createBooking.mutate(
      {
        roomId: id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: guests,
        guests: [{
          firstName: user.firstName || 'Guest',
          lastName: user.lastName || 'User',
          email: user.email || 'guest@example.com', // Fallback email
          phone: user.phone || '0000000000', // Fallback phone
          isPrimary: true
        }],
      },
      {
        onSuccess: () => {
          alert('Booking successful! Redirecting to your bookings...')
          navigate('/bookings')
        },
        onError: (error: any) => {
          alert(`Booking failed: ${error.response?.data?.message || error.message || 'Unknown error'}`)
        },
      }
    )
  }

  if (isLoading) return <Loading />
  if (error || !room) return <div className="container-default py-10">Room not found.</div>

  return (
    <div className="container-default py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <ImageCarousel
            images={room.images || (room.image ? [room.image] : [])}
            alt={room.type}
            className="w-full h-96 rounded overflow-hidden"
          />
        </div>
        <div>
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-semibold">{room.type || 'Room'}</h2>
            <span className={`text-sm px-3 py-1 rounded ${room.status === 'available' ? 'bg-green-100 text-green-700' :
              room.status === 'occupied' ? 'bg-red-100 text-red-700' :
                room.status === 'cleaning' ? 'bg-yellow-100 text-yellow-700' :
                  room.status === 'maintenance' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
              }`}>
              {room.status || 'unknown'}
            </span>
          </div>
          <p className="text-gray-600">Room {room.roomNumber}</p>
          {room.price != null && (
            <div className="mt-3 text-2xl text-brand font-semibold">₹{room.price}/night</div>
          )}
          {room.description && (
            <p className="mt-4 text-gray-700 whitespace-pre-line">{room.description}</p>
          )}
          <div className="mt-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Check-in</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Check-out</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Guests</label>
              <input type="number" min={1} max={10} value={guests} onChange={(e) => setGuests(parseInt(e.target.value))} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="mt-6">
              {room.status !== 'available' && (
                <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                  This room is currently {room.status}. Please check back later or choose another room.
                </div>
              )}
              <button
                onClick={handleBooking}
                disabled={createBooking.isPending || room.status !== 'available'}
                className="bg-brand text-white rounded px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-dark transition-colors"
              >{createBooking.isPending ? 'Booking...' : room.status !== 'available' ? 'Not Available' : 'Book now'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


