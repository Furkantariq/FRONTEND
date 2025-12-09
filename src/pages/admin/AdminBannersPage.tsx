import { useState } from 'react'
import { useAdminBanners, useUploadBanner, useDeleteBanner } from '../../api/admin'
import Loading from '../../components/Loading'
import { getImageUrl } from '../../utils/imageUrl'

export default function AdminBannersPage() {
    const { data, isLoading } = useAdminBanners()
    const uploadBanner = useUploadBanner()
    const deleteBanner = useDeleteBanner()
    const [selectedImages, setSelectedImages] = useState<File[]>([])

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedImages.length === 0) return

        const formData = new FormData()
        selectedImages.forEach((file) => {
            formData.append('images', file)
        })

        try {
            await uploadBanner.mutateAsync(formData)
            setSelectedImages([])
            alert('Banners uploaded successfully!')
        } catch (error) {
            console.error('Upload failed:', error)
            alert('Failed to upload banners')
        }
    }

    if (isLoading) return <Loading />

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Banner Management</h1>
            </div>

            {/* Upload Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">Upload New Banners</h2>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-2">Select Images</label>
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
                        <p className="text-xs text-gray-500 mt-1">
                            Recommended size: 1920x600px or larger. Supported formats: JPG, PNG, WEBP.
                        </p>
                    </div>

                    {/* Preview */}
                    {selectedImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {selectedImages.map((file, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover rounded border"
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
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={selectedImages.length === 0 || uploadBanner.isPending}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploadBanner.isPending ? 'Uploading...' : 'Upload Banners'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Banners List */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-lg font-semibold mb-4">Active Banners ({data?.banners?.length || 0})</h2>

                {(!data?.banners || data.banners.length === 0) ? (
                    <p className="text-gray-500 text-center py-8">No banners found. Upload some images to get started.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.banners.map((banner: any) => (
                            <div key={banner._id} className="border rounded-lg overflow-hidden group relative">
                                <img
                                    src={getImageUrl(banner.imageUrl)}
                                    alt={banner.title || 'Banner'}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={async () => {
                                            if (confirm('Are you sure you want to delete this banner?')) {
                                                try {
                                                    await deleteBanner.mutateAsync(banner._id)
                                                } catch (error) {
                                                    console.error('Delete failed:', error)
                                                }
                                            }
                                        }}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Delete Banner
                                    </button>
                                </div>
                                {banner.title && (
                                    <div className="p-3 bg-gray-50 border-t">
                                        <p className="text-sm font-medium truncate">{banner.title}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
