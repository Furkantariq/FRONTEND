import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMenu } from '../../api/dining'
import { useAuth } from '../../auth/useAuth'
import Loading from '../../components/Loading'
import { getFirstImage } from '../../utils/imageUrl'
import { useCart } from '../../context/CartContext'
import CartDrawer from '../../components/dining/CartDrawer'

const categories = ['appetizers', 'main-course', 'desserts', 'beverages', 'breakfast', 'lunch', 'dinner']

export default function MenuPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const { data: menu, isLoading, error } = useMenu(selectedCategory || undefined)
  const { addToCart, totalItems } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Redirect admins to admin dining page
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/dining')
    }
  }, [user, navigate])

  const handleAddToCart = (item: any) => {
    addToCart({
      menuItemId: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: getFirstImage(item.images)
    })
    setIsCartOpen(true)
  }

  if (isLoading) return <Loading />
  if (error) return <div className="container-default py-10">Failed to load menu.</div>

  return (
    <div className="container-default py-10 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Restaurant Menu</h2>
        {totalItems > 0 && (
          <button
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-6 right-6 z-40 bg-brand text-white px-6 py-3 rounded-full shadow-lg hover:bg-brand-dark transition-colors flex items-center gap-2"
          >
            <span>🛒</span>
            <span className="font-bold">{totalItems} items</span>
          </button>
        )}
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1 rounded text-sm ${selectedCategory === '' ? 'bg-brand text-white' : 'bg-gray-100'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded text-sm capitalize ${selectedCategory === cat ? 'bg-brand text-white' : 'bg-gray-100'}`}
            >
              {cat.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menu?.map((item: any) => (
          <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="relative h-48 bg-gray-100">
              {item.images && item.images.length > 0 ? (
                <img
                  src={getFirstImage(item.images)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-400"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div>' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-sm">No Image</span>
                </div>
              )}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {item.chefSpecial && (
                  <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded-full shadow-sm">
                    Chef's Special
                  </span>
                )}
                {item.seasonal && (
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-sm">
                    Seasonal
                  </span>
                )}
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                  <span className="text-xs font-medium text-gray-500 capitalize">{item.category}</span>
                </div>
                <span className="font-bold text-brand text-lg">${item.price}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {item.isVegetarian && <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">Vegetarian</span>}
                {item.isVegan && <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">Vegan</span>}
                {item.isGlutenFree && <span className="text-xs px-2 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100">GF</span>}
                {item.spiceLevel && item.spiceLevel !== 'mild' && (
                  <span className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded-full border border-red-100 capitalize flex items-center gap-1">
                    🌶️ {item.spiceLevel}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                {item.preparationTime && (
                  <span className="flex items-center gap-1" title="Preparation Time">
                    ⏱️ {item.preparationTime}m
                  </span>
                )}
                {item.calories && (
                  <span className="flex items-center gap-1" title="Calories">
                    🔥 {item.calories} cal
                  </span>
                )}
              </div>

              {item.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
              )}

              {item.ingredients && item.ingredients.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-1 font-medium">Ingredients:</p>
                  <p className="text-xs text-gray-600 line-clamp-2">{item.ingredients.join(', ')}</p>
                </div>
              )}

              {item.allergens && item.allergens.length > 0 && (
                <div className="mb-4 p-2 bg-orange-50 rounded border border-orange-100">
                  <p className="text-xs text-orange-800 flex items-start gap-1">
                    <span className="font-bold">⚠️ Contains:</span> {item.allergens.join(', ')}
                  </p>
                </div>
              )}

              <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </span>
                {item.isAvailable && (
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="text-sm font-medium bg-brand text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  )
}
