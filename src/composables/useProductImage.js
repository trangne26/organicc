import { computed } from 'vue'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/'

export function useProductImage() {
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null
    
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }
    
    return `${baseURL}${imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl}`
  }

  const getPlaceholderUrl = () => {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
  }

  const getPrimaryImage = (product) => {
    if (!product?.images || !Array.isArray(product.images) || product.images.length === 0) {
      return getPlaceholderUrl()
    }

    const primaryImage = product.images.find(img => img.is_primary)
    if (primaryImage) {
      return getImageUrl(primaryImage.url)
    }

    return getImageUrl(product.images[0].url)
  }

  const getAllImages = (product) => {
    if (!product?.images || !Array.isArray(product.images) || product.images.length === 0) {
      return [getPlaceholderUrl()]
    }

    return product.images.map(img => getImageUrl(img.url))
  }

  const handleImageError = (event) => {
    event.target.src = getPlaceholderUrl()
    event.target.onerror = null
  }

  const formatPrice = (price) => {
    const numPrice = parseFloat(price)
    if (isNaN(numPrice)) return '0₫'
    return `${numPrice.toLocaleString('vi-VN')}₫`
  }

  return {
    getImageUrl,
    getPlaceholderUrl,
    getPrimaryImage,
    getAllImages,
    handleImageError,
    formatPrice
  }
}
