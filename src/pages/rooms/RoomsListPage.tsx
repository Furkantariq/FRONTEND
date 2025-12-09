import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRooms } from '../../api/rooms'
import { useAuth } from '../../auth/useAuth'
import Loading from '../../components/Loading'
import RoomCard from '../../components/RoomCard'

export default function RoomsListPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data, isLoading, error } = useRooms()

  // Redirect admins to admin rooms page
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/rooms')
    }
  }, [user, navigate])

  if (isLoading) return <Loading />
  if (error) return <div className="container-default py-10">Failed to load rooms.</div>

  return (
    <div className="container-default py-10">
      <h2 className="text-2xl font-semibold mb-6">Rooms</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data?.map((room: any) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  )
}


