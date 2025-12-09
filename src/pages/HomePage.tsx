import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../api/client'
import {
  Hotel,
  Utensils,
  Car,
  ArrowRight,
  Wifi,
  Coffee,
  Dumbbell,
  MapPin
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { getImageUrl } from '../utils/imageUrl'
import RoomCard from '../components/RoomCard'

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [bannerImages, setBannerImages] = useState<string[]>([])

  // Fetch banners for hero carousel
  const { data: bannersData } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const res = await api.get('/banners')
      return res.data
    }
  })

  useEffect(() => {
    if (bannersData?.banners && bannersData.banners.length > 0) {
      setBannerImages(bannersData.banners.map((b: any) => b.imageUrl))
    }
  }, [bannersData])

  // Auto-rotate hero images every 3 seconds
  useEffect(() => {
    if (bannerImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % bannerImages.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [bannerImages])

  // Fetch featured rooms for the featured section
  const { data: roomsData } = useQuery({
    queryKey: ['featured-rooms'],
    queryFn: async () => {
      const res = await api.get('/rooms?limit=3')
      return res.data
    }
  })

  const heroImage = bannerImages.length > 0
    ? getImageUrl(bannerImages[currentImageIndex])
    : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80'

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative container-default h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Experience Luxury & Comfort
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Your perfect getaway awaits. Book rooms, dine in style, and explore with ease.
            </p>
            <div className="flex gap-4">
              <Link
                to="/rooms"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-xl"
              >
                Book Now
              </Link>
              <Link
                to="/dining"
                className="px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-lg font-semibold text-lg transition-all border-2 border-white/30"
              >
                Explore Dining
              </Link>
            </div>
          </div>
        </div>

        {/* Image Indicators */}
        {bannerImages.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            {bannerImages.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w - 3 h - 3 rounded - full transition - all ${index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                  } `}
              />
            ))}
          </div>
        )}
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-default">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything you need for a perfect stay, all in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard
              icon={Hotel}
              title="Luxury Rooms"
              description="Explore our collection of beautifully designed rooms with premium amenities."
              link="/rooms"
              color="blue"
            />
            <ServiceCard
              icon={Utensils}
              title="Fine Dining"
              description="Savor exquisite cuisine from our award-winning chefs and diverse menu."
              link="/dining"
              color="orange"
            />
            <ServiceCard
              icon={Car}
              title="Car Rentals"
              description="Book a premium vehicle for your journey and explore at your own pace."
              link="/cars"
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      {roomsData?.rooms && roomsData.rooms.length > 0 && (
        <section className="py-20">
          <div className="container-default">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Rooms</h2>
                <p className="text-gray-600">Handpicked accommodations for your comfort</p>
              </div>
              <Link to="/rooms" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
                View All <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {roomsData.rooms.slice(0, 3).map((room: any) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Amenities Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="container-default">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">World-Class Amenities</h2>
            <p className="text-blue-100 text-lg">Everything you need for an unforgettable stay</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <AmenityItem icon={Wifi} text="Free WiFi" />
            <AmenityItem icon={Coffee} text="Breakfast Included" />
            <AmenityItem icon={Dumbbell} text="Fitness Center" />
            <AmenityItem icon={MapPin} text="Prime Location" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container-default text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Book Your Stay?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied guests who have experienced our exceptional hospitality
          </p>
          <Link
            to="/rooms"
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
          >
            Explore Rooms
          </Link>
        </div>
      </section>
    </div>
  )
}

function ServiceCard({ icon: Icon, title, description, link, color }: {
  icon: any;
  title: string;
  description: string;
  link: string;
  color: 'blue' | 'orange' | 'purple'
}) {
  const colorClasses: Record<'blue' | 'orange' | 'purple', string> = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
  }

  return (
    <Link
      to={link}
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-2"
    >
      <div className={`h - 2 bg - gradient - to - r ${colorClasses[color]} `}></div>
      <div className="p-8">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
          <Icon className="w-8 h-8 text-gray-700" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 transition-all">
          Learn More <ArrowRight className="w-5 h-5 ml-2" />
        </div>
      </div>
    </Link>
  )
}

function AmenityItem({ icon: Icon, text }: any) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <span className="font-medium">{text}</span>
    </div>
  )
}
