<template>
  <div class="product-detail">
    <div v-if="loading" class="container mx-auto px-4 py-8">
      <div class="animate-pulse">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-gray-300 h-96 rounded-lg"></div>
          <div class="space-y-4">
            <div class="h-8 bg-gray-300 rounded"></div>
            <div class="h-4 bg-gray-300 rounded w-3/4"></div>
            <div class="h-6 bg-gray-300 rounded w-1/2"></div>
            <div class="h-20 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="error || !product" class="container mx-auto px-4 py-16 text-center">
      <div class="text-6xl text-gray-400 mb-4">😞</div>
      <h2 class="text-2xl font-bold text-gray-600 mb-4">{{ error || 'Không tìm thấy sản phẩm' }}</h2>
      <router-link
        to="/products"
        class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
      >
        Quay lại danh sách sản phẩm
      </router-link>
    </div>
    <div v-else class="container mx-auto px-4 py-8">
      <nav class="flex mb-8" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2 text-sm">
          <li>
            <router-link to="/" class="text-gray-500 hover:text-green-600">Trang chủ</router-link>
          </li>
          <li class="text-gray-400">/</li>
          <li>
            <router-link to="/products" class="text-gray-500 hover:text-green-600">Sản phẩm</router-link>
          </li>
          <li class="text-gray-400">/</li>
          <li class="text-gray-700 font-medium">{{ product.name }}</li>
        </ol>
      </nav>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="space-y-4">
          <div class="relative">
            <img
              :src="selectedImage"
              :alt="product.name"
              class="w-full h-96 object-cover rounded-lg shadow-lg"
              @error="handleImageError"
            />
            <button
              v-if="product.images && product.images.length > 1"
              @click="showImageModal = true"
              class="absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-md transition-all"
              aria-label="Xem ảnh lớn"
            >
              🔍
            </button>
          </div>
          <div v-if="product.images && product.images.length > 1" class="flex space-x-2 overflow-x-auto">
            <button
              v-for="(image, index) in product.images"
              :key="index"
              @click="selectedImage = getImageUrl(image.url)"
              :class="[
                'flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all',
                selectedImage === getImageUrl(image.url) ? 'border-green-600' : 'border-gray-300 hover:border-gray-400'
              ]"
            >
              <img :src="getImageUrl(image.url)" :alt="`${product.name} ${index + 1}`" class="w-full h-full object-cover" @error="handleImageError" />
            </button>
          </div>
        </div>
        <div class="space-y-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ product.name }}</h1>
            <p v-if="product.shortDescription" class="text-gray-600">{{ product.shortDescription }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <span
              v-if="product.originalPrice && product.originalPrice !== product.price"
              class="text-xl text-gray-400 line-through"
            >
              {{ formatPrice(product.originalPrice) }}
            </span>
            <span class="text-3xl font-bold text-orange-500">
              {{ formatPrice(product.price) }}
            </span>
            <span
              v-if="product.discount"
              class="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
            >
              -{{ product.discount }}%
            </span>
          </div>
          <div v-if="product.certifications && product.certifications.length > 0">
            <h3 class="text-sm font-semibold text-gray-700 mb-2">Chứng nhận:</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="cert in product.certifications"
                :key="cert"
                class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ getCertificationLabel(cert) }}
              </span>
            </div>
          </div>
          <div class="border-t border-gray-200 pt-6">
            <div class="flex items-center space-x-4 mb-4">
              <label class="text-sm font-medium text-gray-700">Số lượng:</label>
              <div class="flex items-center border border-gray-300 rounded-lg">
                <button
                  @click="decreaseQuantity"
                  :disabled="quantity <= 1"
                  class="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <input
                  v-model.number="quantity"
                  type="number"
                  min="1"
                  class="w-16 text-center py-2 border-0 focus:ring-0"
                />
                <button
                  @click="increaseQuantity"
                  class="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  +
                </button>
              </div>
              <span v-if="product.unit" class="text-sm text-gray-600">{{ product.unit }}</span>
            </div>
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                @click="addToCart"
                class="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <span>🛒</span>
                <span>Thêm vào giỏ hàng</span>
              </button>
              <button
                @click="toggleWishlist"
                :class="[
                  'px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2',
                  isInWishlist
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                ]"
              >
                <span>{{ isInWishlist ? '❤️' : '🤍' }}</span>
                <span>{{ isInWishlist ? 'Đã yêu thích' : 'Yêu thích' }}</span>
              </button>
            </div>
          </div>
          <div v-if="product.origin || product.weight || product.expiry || product.storage" class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Thông tin sản phẩm</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div v-if="product.origin">
                <span class="font-medium text-gray-700">Xuất xứ:</span>
                <span class="text-gray-600 ml-2">{{ product.origin }}</span>
              </div>
              <div v-if="product.weight">
                <span class="font-medium text-gray-700">Khối lượng:</span>
                <span class="text-gray-600 ml-2">{{ product.weight }}</span>
              </div>
              <div v-if="product.expiry">
                <span class="font-medium text-gray-700">Hạn sử dụng:</span>
                <span class="text-gray-600 ml-2">{{ product.expiry }}</span>
              </div>
              <div v-if="product.storage">
                <span class="font-medium text-gray-700">Bảo quản:</span>
                <span class="text-gray-600 ml-2">{{ product.storage }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="product.description" class="mt-12 border-t border-gray-200 pt-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Mô tả sản phẩm</h2>
        <div class="prose max-w-none text-gray-600" v-html="product.description"></div>
      </div>
      <div v-if="relatedProducts.length > 0" class="mt-12 border-t border-gray-200 pt-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Sản phẩm liên quan</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="relatedProduct in relatedProducts" :key="relatedProduct.id" class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <router-link :to="`/product/${relatedProduct.id}`">
              <img :src="relatedProduct.image"
                :alt="relatedProduct.name"
                class="w-full h-32 object-cover rounded-t-lg"
                @error="handleImageError"
              />
              <div class="p-3">
                <h3 class="text-sm font-semibold text-gray-800 mb-1 hover:text-green-600 transition-colors">
                  {{ relatedProduct.name }}
                </h3>
                <span class="text-orange-500 font-bold text-sm">
                  {{ formatPrice(relatedProduct.price) }}
                </span>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductImage } from '@/composables/useProductImage'
import { getProduct, listProducts } from '@/api/products'
import { useCart } from '@/composables/useCart'
import { useNotification } from '@/composables/useNotification'

const route = useRoute()
const { getImageUrl, getAllImages, formatPrice, handleImageError, getPrimaryImage } = useProductImage()
const { addToCart: addItemToCart } = useCart()
const { showSuccess, showError } = useNotification()

const loading = ref(true)
const error = ref(null)
const product = ref(null)
const selectedImage = ref('')
const quantity = ref(1)
const showImageModal = ref(false)
const isInWishlist = ref(false)

const relatedProducts = ref([])

const getCertificationLabel = (cert) => {
  const labels = {
    organic: 'Hữu cơ',
    vegan: 'Thuần chay',
    'gluten-free': 'Không gluten',
    'non-gmo': 'Không biến đổi gen'
  }
  return labels[cert] || cert
}

const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  if (!product.value) return
  
  const result = addItemToCart(product.value, quantity.value)
  if (result.success) {
    showSuccess(result.message)
  } else {
    showError('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng')
  }
}

const toggleWishlist = () => {
  isInWishlist.value = !isInWishlist.value
  console.log('Toggle wishlist:', isInWishlist.value)
}

const fetchProduct = async (productId) => {
  try {
    loading.value = true
    error.value = null
    
    const response = await getProduct(productId)
    
    if (response.success && response.data) {
      product.value = response.data
      
      // Set selected image
      if (product.value.images && product.value.images.length > 0) {
        const primaryImage = product.value.images.find(img => img.is_primary)
        selectedImage.value = getImageUrl(primaryImage ? primaryImage.url : product.value.images[0].url)
      } else if (product.value.primary_image) {
        selectedImage.value = getImageUrl(product.value.primary_image)
      }
      
      // Fetch related products from same category
      if (product.value.category?.id) {
        await fetchRelatedProducts(product.value.category.id, productId)
      }
    } else {
      error.value = 'Không tìm thấy sản phẩm'
      product.value = null
    }
  } catch (err) {
    console.error('Error fetching product:', err)
    error.value = 'Có lỗi xảy ra khi tải thông tin sản phẩm'
    product.value = null
  } finally {
    loading.value = false
  }
}

const fetchRelatedProducts = async (categoryId, excludeProductId) => {
  try {
    const response = await listProducts({
      category_id: categoryId,
      active: true,
      per_page: 5 // Get 5 to ensure we have 4 after filtering out current product
    })
    
    if (response.success && response.data) {
      // Filter out current product and limit to 4
      relatedProducts.value = response.data
        .filter(p => p.id !== excludeProductId)
        .slice(0, 4)
        .map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: getPrimaryImage(p)
        }))
    }
  } catch (err) {
    console.error('Error fetching related products:', err)
    relatedProducts.value = []
  }
}

// Watch for route changes to reload product
watch(() => route.params.id, (newId) => {
  if (newId) {
    quantity.value = 1 // Reset quantity when product changes
    fetchProduct(newId)
  }
}, { immediate: false })

onMounted(async () => {
  const productId = route.params.id
  if (productId) {
    await fetchProduct(productId)
  } else {
    error.value = 'Không tìm thấy ID sản phẩm'
    loading.value = false
  }
})
</script>

<style scoped>
.prose ul {
  list-style-type: disc;
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem 0;
}

.prose p {
  margin-bottom: 1rem;
}
</style>
