import { useState } from 'react'
import { getImageUrl } from '../utils/imageUrl'

interface ImageCarouselProps {
    images: string[]
    alt?: string
    className?: string
    showControls?: boolean
}

export function ImageCarousel({ images, alt = 'Image', className = '', showControls = true }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    if (!images || images.length === 0) {
        return (
            <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
                <span className="text-gray-400">No images</span>
            </div>
        )
    }

    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
    }

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
    }

    const goToIndex = (index: number) => {
        setCurrentIndex(index)
    }

    return (
        <div className={`relative group ${className}`}>
            {/* Main Image */}
            <img
                src={getImageUrl(images[currentIndex])}
                alt={`${alt} ${currentIndex + 1}`}
                className="w-full h-full object-cover"
            />

            {/* Image Counter */}
            {images.length > 1 && (
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {currentIndex + 1} / {images.length}
                </div>
            )}

            {/* Navigation Arrows */}
            {showControls && images.length > 1 && (
                <>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            goToPrevious()
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Previous image"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            goToNext()
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Next image"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}

            {/* Indicator Dots */}
            {images.length > 1 && images.length <= 10 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation()
                                goToIndex(index)
                            }}
                            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                ? 'bg-white w-4'
                                : 'bg-white/50 hover:bg-white/75'
                                }`}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
