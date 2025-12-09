import { useState } from 'react'
import { useAdminRooms, useCreateRoom, useUpdateRoomStatus, useUpdateRoom, useDeleteRoom, useDeleteRoomImage } from '../../api/admin'
import Loading from '../../components/Loading'
import { getImageUrl } from '../../utils/imageUrl'
import { ImageCarousel } from '../../components/ImageCarousel'

export default function AdminRoomsPage() {
  const [filters, setFilters] = useState<{ status?: string; type?: string; page?: number; limit?: number }>({})
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingRoom, setEditingRoom] = useState<any>(null)
  const { data, isLoading, error } = useAdminRooms(filters)
  const createRoom = useCreateRoom()
  const updateStatus = useUpdateRoomStatus()
  const updateRoom = useUpdateRoom()
  const deleteRoom = useDeleteRoom()

  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    type: 'standard',
    price: '',
    capacity: '',
    numberOfBeds: '',
    bathroomAttached: false,
    description: '',
    amenities: '',
    floor: '',
    size: '',
    view: 'none'
  })
  const [selectedImages, setSelectedImages] = useState<File[]>([])

  if (isLoading) return <Loading />
  if (error) return <div className="container-default py-10">Failed to load rooms.</div>

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    Object.entries(newRoom).forEach(([key, value]) => {
      formData.append(key, value.toString())
    })

    // Append image files
    selectedImages.forEach((file) => {
      formData.append('images', file)
    })

    try {
      await createRoom.mutateAsync(formData)
      setShowCreateForm(false)
      setNewRoom({
        roomNumber: '',
        type: 'standard',
        price: '',
        capacity: '',
        numberOfBeds: '',
        bathroomAttached: false,
        description: '',
        amenities: '',
        floor: '',
        size: '',
        view: 'none'
      })
      setSelectedImages([])
    } catch (error) {
      console.error('Failed to create room:', error)
    }
  }

  const handleStatusUpdate = async (roomId: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ roomId, status })
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const handleDeleteRoom = async (roomId: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      try {
        await deleteRoom.mutateAsync(roomId)
      } catch (error) {
        console.error('Failed to delete room:', error)
      }
    }
  }

  return (
    <div className="container-default py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Room Management</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-brand text-white px-4 py-2 rounded"
        >
          {showCreateForm ? 'Cancel' : 'Add New Room'}
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select
          value={filters.status || ''}
          onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
          className="border rounded px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
          <option value="cleaning">Cleaning</option>
        </select>
        <select
          value={filters.type || ''}
          onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined })}
          className="border rounded px-3 py-2"
        >
          <option value="">All Types</option>
          <option value="standard">Standard</option>
          <option value="deluxe">Deluxe</option>
          <option value="suite">Suite</option>
          <option value="presidential">Presidential</option>
        </select>
      </div>

      {/* Create Room Form */}
      {showCreateForm && (
        <div className="mb-6 p-6 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Create New Room</h3>
          <form onSubmit={handleCreateRoom} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Room Number</label>
              <input
                type="text"
                value={newRoom.roomNumber}
                onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Type</label>
              <select
                value={newRoom.type}
                onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="standard">Standard</option>
                <option value="deluxe">Deluxe</option>
                <option value="suite">Suite</option>
                <option value="presidential">Presidential</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Price</label>
              <input
                type="number"
                value={newRoom.price}
                onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Capacity</label>
              <input
                type="number"
                value={newRoom.capacity}
                onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Number of Beds</label>
              <input
                type="number"
                value={newRoom.numberOfBeds}
                onChange={(e) => setNewRoom({ ...newRoom, numberOfBeds: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Floor</label>
              <input
                type="number"
                value={newRoom.floor}
                onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Description</label>
              <textarea
                value={newRoom.description}
                onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                className="w-full border rounded px-3 py-2"
                rows={3}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Amenities (comma-separated)</label>
              <input
                type="text"
                value={newRoom.amenities}
                onChange={(e) => setNewRoom({ ...newRoom, amenities: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="WiFi, TV, Mini Bar, etc."
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Room Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setSelectedImages(Array.from(e.target.files))
                  }
                }}
                className="w-full border rounded px-3 py-2"
              />
              <p className="text-xs text-gray-500 mt-1">Select multiple images (JPG, PNG, WEBP)</p>

              {/* Image Preview */}
              {selectedImages.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={createRoom.isPending}
                className="bg-brand text-white px-6 py-2 rounded disabled:opacity-50"
              >
                {createRoom.isPending ? 'Creating...' : 'Create Room'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rooms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.rooms?.map((room: any) => (
          <div key={room._id} className="border rounded-lg overflow-hidden">
            {room.images && room.images.length > 0 && (
              <ImageCarousel images={room.images} alt={room.type} className="w-full h-40" />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">Room {room.roomNumber}</h3>
                <span className={`text-xs px-2 py-1 rounded ${room.status === 'available' ? 'bg-green-100 text-green-700' :
                  room.status === 'occupied' ? 'bg-red-100 text-red-700' :
                    room.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                  }`}>
                  {room.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>{room.type} • ₹{room.price}/night</div>
                <div>Capacity: {room.capacity} • Beds: {room.numberOfBeds}</div>
                {room.floor && <div>Floor: {room.floor}</div>}
              </div>
              <div className="mt-3 flex gap-2">
                <select
                  value={room.status}
                  onChange={(e) => handleStatusUpdate(room._id, e.target.value)}
                  className="text-xs border rounded px-2 py-1"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="cleaning">Cleaning</option>
                </select>
                <button
                  onClick={() => setEditingRoom(room)}
                  className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteRoom(room._id)}
                  className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
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

      {/* Edit Room Modal */}
      {editingRoom && (
        <EditRoomModal
          room={editingRoom}
          onClose={() => setEditingRoom(null)}
          onUpdate={updateRoom}
        />
      )}
    </div>
  )
}


function EditRoomModal({ room, onClose, onUpdate }: { room: any; onClose: () => void; onUpdate: any }) {
  const deleteRoomImage = useDeleteRoomImage()
  const [formData, setFormData] = useState({
    roomNumber: room.roomNumber || '',
    type: room.type || 'standard',
    price: room.price?.toString() || '',
    capacity: room.capacity?.toString() || '',
    numberOfBeds: room.numberOfBeds?.toString() || '',
    bathroomAttached: room.bathroomAttached || false,
    description: room.description || '',
    amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : '',
    floor: room.floor?.toString() || '',
    size: room.size?.toString() || '',
    view: room.view || 'none'
  })
  const [selectedImages, setSelectedImages] = useState<File[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const updateData = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      updateData.append(key, value.toString())
    })

    selectedImages.forEach((file) => {
      updateData.append('images', file)
    })

    try {
      await onUpdate.mutateAsync({ roomId: room._id, roomData: updateData })
      onClose()
    } catch (error) {
      console.error('Failed to update room:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h3 className="text-lg font-semibold mb-4">Edit Room {room.roomNumber}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Room Number</label>
            <input
              type="text"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full border rounded px-3 py-2"
            >
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Suite</option>
              <option value="presidential">Presidential</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Price</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Capacity</label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Number of Beds</label>
            <input
              type="number"
              value={formData.numberOfBeds}
              onChange={(e) => setFormData({ ...formData, numberOfBeds: e.target.value })}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Floor</label>
            <input
              type="number"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Room Images</label>

            {/* Existing Images */}
            {room.images && room.images.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Existing Images ({room.images.length})</p>
                <div className="grid grid-cols-4 gap-2">
                  {room.images.map((imageUrl: string, index: number) => (
                    <div key={index} className="relative group">
                      <img
                        src={getImageUrl(imageUrl)}
                        alt={`Room ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this image?')) {
                            try {
                              await deleteRoomImage.mutateAsync({ roomId: room._id, imageIndex: index })
                            } catch (error) {
                              console.error('Failed to delete image:', error)
                            }
                          }
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Images */}
            <label className="block text-sm text-gray-600 mb-1">Add New Images (optional)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  setSelectedImages(Array.from(e.target.files))
                }
              }}
              className="w-full border rounded px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">New images will be added to existing images</p>

            {/* New Images Preview */}
            {selectedImages.length > 0 && (
              <div className="mt-3">
                <p className="text-xs text-gray-500 mb-2">New Images to Upload ({selectedImages.length})</p>
                <div className="grid grid-cols-4 gap-2">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update Room
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
