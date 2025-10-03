import { computed } from 'vue'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/'

export function useProductImage() {
  /**
   * Tạo URL đầy đủ cho ảnh sản phẩm
   * @param {string} imageUrl - URL ảnh từ API
   * @returns {string} URL đầy đủ
   */
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null
    
    // Nếu đã là URL đầy đủ, trả về nguyên vẹn
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl
    }
    
    // Ghép với base URL
    return `${baseURL}${imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl}`
  }

  /**
   * Tạo URL placeholder an toàn
   * @returns {string} URL placeholder
   */
  const getPlaceholderUrl = () => {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
  }

  /**
   * Lấy ảnh chính của sản phẩm
   * @param {Object} product - Object sản phẩm
   * @returns {string} URL ảnh chính
   */
  const getPrimaryImage = (product) => {
    if (!product?.images || !Array.isArray(product.images) || product.images.length === 0) {
      return getPlaceholderUrl()
    }

    // Tìm ảnh có is_primary = true
    const primaryImage = product.images.find(img => img.is_primary)
    if (primaryImage) {
      return getImageUrl(primaryImage.url)
    }

    // Nếu không có ảnh chính, lấy ảnh đầu tiên
    return getImageUrl(product.images[0].url)
  }

  /**
   * Lấy tất cả ảnh của sản phẩm với URL đầy đủ
   * @param {Object} product - Object sản phẩm
   * @returns {Array} Mảng URL ảnh
   */
  const getAllImages = (product) => {
    if (!product?.images || !Array.isArray(product.images) || product.images.length === 0) {
      return [getPlaceholderUrl()]
    }

    return product.images.map(img => getImageUrl(img.url))
  }

  /**
   * Xử lý lỗi ảnh và trả về placeholder
   * @param {Event} event - Error event từ img tag
   * @returns {void}
   */
  const handleImageError = (event) => {
    event.target.src = getPlaceholderUrl()
    event.target.onerror = null // Ngăn vòng lặp vô hạn
  }

  /**
   * Computed để format giá tiền
   * @param {string|number} price - Giá sản phẩm
   * @returns {string} Giá đã format
   */
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
