import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCars } from '../../api/cars'
import { useAuth } from '../../auth/useAuth'
import Loading from '../../components/Loading'
import { getFirstImage } from '../../utils/imageUrl'

const carTypes = ['economy', 'compact', 'midsize', 'fullsize', 'luxury', 'suv', 'van']

export default function CarsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [filters, setFilters] = useState<{ type?: string; minPrice?: number; maxPrice?: number }>({})
  const { data: cars, isLoading, error } = useCars(filters)

  // Redirect admins to admin cars page
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/cars')
    }
  }, [user, navigate])

  if (isLoading) return <Loading />
  if (error) return <div className="container-default py-10">Failed to load cars.</div>

  return (
    <div className="container-default py-10">
      <h2 className="text-2xl font-semibold mb-6">Car Rental</h2>

      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilters({ ...filters, type: undefined })}
            className={`px-3 py-1 rounded text-sm ${!filters.type ? 'bg-brand text-white' : 'bg-gray-100'}`}
          >
            All Types
          </button>
          {carTypes.map(type => (
            <button
              key={type}
              onClick={() => setFilters({ ...filters, type })}
              className={`px-3 py-1 rounded text-sm capitalize ${filters.type === type ? 'bg-brand text-white' : 'bg-gray-100'}`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Min Price</label>
            <input
              type="number"
              value={filters.minPrice || ''}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
              className="border rounded px-3 py-2 w-24"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Max Price</label>
            <input
              type="number"
              value={filters.maxPrice || ''}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
              className="border rounded px-3 py-2 w-24"
              placeholder="1000"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars?.map((car: any) => (
          <div key={car._id} className="border rounded-lg overflow-hidden">
            {(car.images || car.image) && (
              <img
                src={getFirstImage(car.images || car.image)}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-40 object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{car.make} {car.model}</h3>
                <span className="text-brand font-semibold">${car.price || car.rentalPrice}/day</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>{car.year} • {car.numberOfSeats || car.seats} seats</div>
                <div>{car.transmission || 'Automatic'} • {car.fuelType || 'Gasoline'}</div>
                <div className="capitalize">{car.type}</div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded ${car.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {car.status === 'available' ? 'Available' : 'Unavailable'}
                </span>
                <button className="px-3 py-1 bg-brand text-white rounded text-sm">Request</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
