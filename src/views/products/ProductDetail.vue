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

    <div v-else-if="!product" class="container mx-auto px-4 py-16 text-center">
      <div class="text-6xl text-gray-400 mb-4">😞</div>
      <h2 class="text-2xl font-bold text-gray-600 mb-4">Không tìm thấy sản phẩm</h2>
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
              @click="selectedImage = image"
              :class="[
                'flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all',
                selectedImage === image ? 'border-green-600' : 'border-gray-300 hover:border-gray-400'
              ]"
            >
              <img :src="image" :alt="`${product.name} ${index + 1}`" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <div class="space-y-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ product.name }}</h1>
            <p class="text-gray-600">{{ product.shortDescription }}</p>
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
              <span class="text-sm text-gray-600">{{ product.unit }}</span>
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

          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Thông tin sản phẩm</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="font-medium text-gray-700">Xuất xứ:</span>
                <span class="text-gray-600 ml-2">{{ product.origin || 'Việt Nam' }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Khối lượng:</span>
                <span class="text-gray-600 ml-2">{{ product.weight || 'N/A' }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Hạn sử dụng:</span>
                <span class="text-gray-600 ml-2">{{ product.expiry || 'N/A' }}</span>
              </div>
              <div>
                <span class="font-medium text-gray-700">Bảo quản:</span>
                <span class="text-gray-600 ml-2">{{ product.storage || 'Nơi khô ráo, thoáng mát' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12 border-t border-gray-200 pt-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Mô tả sản phẩm</h2>
        <div class="prose max-w-none text-gray-600" v-html="product.description"></div>
      </div>

      <div class="mt-12 border-t border-gray-200 pt-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Sản phẩm liên quan</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="relatedProduct in relatedProducts"
            :key="relatedProduct.id"
            class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <router-link :to="`/product/${relatedProduct.id}`">
              <img
                :src="relatedProduct.image"
                :alt="relatedProduct.name"
                class="w-full h-32 object-cover rounded-t-lg"
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const productId = computed(() => route.params.id)

const loading = ref(true)
const product = ref(null)
const selectedImage = ref('')
const quantity = ref(1)
const showImageModal = ref(false)
const isInWishlist = ref(false)

const relatedProducts = ref([])

const mockProduct = {
  id: 1,
  name: 'Rau cải xanh hữu cơ',
  shortDescription: 'Rau cải xanh tươi ngon, không thuốc trừ sâu',
  description: `
    <p>Rau cải xanh hữu cơ được trồng theo phương pháp canh tác hữu cơ, không sử dụng thuốc trừ sâu hay phân bón hóa học.</p>
    <p>Sản phẩm giàu vitamin A, C, K và các khoáng chất thiết yếu, giúp tăng cường sức khỏe và hệ miễn dịch.</p>
    <h4>Lợi ích:</h4>
    <ul>
      <li>Giàu chất xơ, hỗ trợ tiêu hóa</li>
      <li>Chứa nhiều vitamin và khoáng chất</li>
      <li>Không chứa hóa chất độc hại</li>
      <li>Tươi ngon, giòn ngọt tự nhiên</li>
    </ul>
  `,
  price: 25000,
  originalPrice: null,
  discount: null,
  images: ['/images/products/cai-xanh.jpg', '/images/products/cai-xanh-2.jpg'],
  category: 'vegetables',
  certifications: ['organic', 'vegan'],
  origin: 'Đà Lạt, Lâm Đồng',
  weight: '500g',
  expiry: '3-5 ngày',
  storage: 'Bảo quản trong ngăn mát tủ lạnh',
  unit: 'bó'
}

const getCertificationLabel = (cert) => {
  const labels = {
    organic: 'Hữu cơ',
    vegan: 'Thuần chay',
    'gluten-free': 'Không gluten',
    'non-gmo': 'Không biến đổi gen'
  }
  return labels[cert] || cert
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
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
  console.log('Add to cart:', {
    product: product.value,
    quantity: quantity.value
  })
}

const toggleWishlist = () => {
  isInWishlist.value = !isInWishlist.value
  console.log('Toggle wishlist:', isInWishlist.value)
}

onMounted(async () => {
  setTimeout(() => {
    product.value = mockProduct
    selectedImage.value = product.value.images[0]

    relatedProducts.value = [
      {
        id: 2,
        name: 'Cà chua cherry hữu cơ',
        price: 35000,
        image: '/images/products/ca-chua-cherry.jpg'
      },
      {
        id: 3,
        name: 'Xà lách xoăn hữu cơ',
        price: 20000,
        image: '/images/products/xa-lach-xoan.jpg'
      }
    ]
    
    loading.value = false
  }, 1000)
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
