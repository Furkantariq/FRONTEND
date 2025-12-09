import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getImageUrl } from '../utils/imageUrl'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface RoomCardProps {
    room: {
        _id: string
        type: string
        roomNumber: string | number
        price?: number
        status: string
        images?: string[]
        image?: string
    }
}

export default function RoomCard({ room }: RoomCardProps) {
    const images = room.images || (room.image ? [room.image] : [])
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'available':
                return 'bg-green-100 text-green-700'
            case 'occupied':
                return 'bg-red-100 text-red-700'
            case 'cleaning':
                return 'bg-yellow-100 text-yellow-700'
            case 'maintenance':
                return 'bg-orange-100 text-orange-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    return (
        <Link
            to={`/rooms/${room._id}`}
            className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
            {/* Image Carousel */}
            {images.length > 0 && (
                <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
                    <img
                        src={getImageUrl(images[currentImageIndex])}
                        alt={`${room.type} - Image ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image'
                        }}
                    />

                    {/* Carousel Controls - Only show if multiple images */}
                    {images.length > 1 && (
                        <>
                            {/* Previous Button */}
                            <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-800" />
                            </button>

                            {/* Next Button */}
                            <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-800" />
                            </button>

                            {/* Image Indicators */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                {images.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            setCurrentImageIndex(index)
                                        }}
                                        className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex
                                                ? 'bg-white w-6'
                                                : 'bg-white/60 hover:bg-white/80'
                                            }`}
                                        aria-label={`Go to image ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Card Content */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-lg">{room.type || 'Room'}</div>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusStyle(room.status)}`}>
                        {room.status || 'unknown'}
                    </span>
                </div>
                <div className="text-sm text-gray-600">Room {room.roomNumber}</div>
                {room.price != null && (
                    <div className="mt-2 text-brand font-semibold text-lg">₹{room.price}/night</div>
                )}
            </div>
        </Link>
    )
}
