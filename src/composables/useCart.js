import { ref, computed, watch } from 'vue'
import { useProductImage } from './useProductImage'

const CART_STORAGE_KEY = 'organicc_cart'

const cartItems = ref([])

const loadCartFromStorage = () => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart)
      
      const migratedCart = parsedCart.map(item => {
        if (item.image && !item.image.startsWith('http') && !item.image.startsWith('data:')) {
          return {
            ...item,
            image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
          }
        }
        return item
      })
      
      cartItems.value = migratedCart
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error)
    cartItems.value = []
  }
}

const saveCartToStorage = () => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems.value))
  } catch (error) {
    console.error('Error saving cart to localStorage:', error)
  }
}

loadCartFromStorage()

watch(cartItems, () => {
  saveCartToStorage()
}, { deep: true })

export const useCart = () => {
  const { getPrimaryImage } = useProductImage()
  
  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.value.find(item => item.id === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      console.log('product', product)
      const cartItem = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: quantity,
        images: product.images,
        unit: product.unit || 'sản phẩm',
        category_id: product.category_id,
        slug: product.slug
      }
      cartItems.value.push(cartItem)
    }
    
    return { success: true, message: 'Đã thêm sản phẩm vào giỏ hàng' }
  }

  const removeFromCart = (productId) => {
    const index = cartItems.value.findIndex(item => item.id === productId)
    if (index > -1) {
      cartItems.value.splice(index, 1)
      return { success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng' }
    }
    return { success: false, message: 'Không tìm thấy sản phẩm trong giỏ hàng' }
  }

  const updateQuantity = (productId, quantity) => {
    const item = cartItems.value.find(item => item.id === productId)
    if (item) {
      if (quantity <= 0) {
        return removeFromCart(productId)
      }
      item.quantity = quantity
      return { success: true, message: 'Đã cập nhật số lượng sản phẩm' }
    }
    return { success: false, message: 'Không tìm thấy sản phẩm trong giỏ hàng' }
  }

  const clearCart = () => {
    cartItems.value = []
    return { success: true, message: 'Đã xóa toàn bộ giỏ hàng' }
  }

  const reloadCart = () => {
    loadCartFromStorage()
    return { success: true, message: 'Đã tải lại giỏ hàng' }
  }

  const getItemCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const getTotalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
  })

  const isInCart = (productId) => {
    return cartItems.value.some(item => item.id === productId)
  }

  const getItemQuantity = (productId) => {
    const item = cartItems.value.find(item => item.id === productId)
    return item ? item.quantity : 0
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  return {
    cartItems,
    
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    reloadCart,
    
    getItemCount,
    getTotalPrice,
    
    isInCart,
    getItemQuantity,
    formatPrice
  }
}
