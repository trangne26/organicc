<template>
  <div class="product-list">
    <section class="page-header bg-green-50 py-12">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-800 mb-4">
            {{ pageTitle }}
          </h1>
          <p class="text-gray-600">
            Khám phá các sản phẩm hữu cơ chất lượng cao
          </p>
        </div>
      </div>
    </section>
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <aside class="lg:w-1/4">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Bộ lọc</h3>
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <input
                v-model="filters.search"
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                @input="applyFilters"
              />
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </label>
              <select
                v-model="filters.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                @change="applyFilters"
              >
                <option value="">Tất cả danh mục</option>
                <option v-for="category in categories" :key="category.value" :value="category.value">
                  {{ category.label }}
                </option>
              </select>
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Khoảng giá
              </label>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input
                    v-model="filters.minPrice"
                    type="number"
                    placeholder="Từ"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    @input="applyFilters"
                  />
                </div>
                <div class="flex items-center">
                  <input
                    v-model="filters.maxPrice"
                    type="number"
                    placeholder="Đến"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    @input="applyFilters"
                  />
                </div>
              </div>
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Chứng nhận
              </label>
              <div class="space-y-2">
                <label v-for="cert in certifications" :key="cert.value" class="flex items-center">
                  <input
                    v-model="filters.certifications"
                    :value="cert.value"
                    type="checkbox"
                    class="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    @change="applyFilters"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ cert.label }}</span>
                </label>
              </div>
            </div>
            <button
              @click="clearFilters"
              class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        </aside>
        <main class="lg:w-3/4">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <p class="text-gray-600">
              Hiển thị {{ filteredProducts.length }} sản phẩm
            </p>
            <select
              v-model="sortBy"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              @change="applySorting"
            >
              <option value="name">Sắp xếp theo tên</option>
              <option value="price-asc">Giá: Thấp đến cao</option>
              <option value="price-desc">Giá: Cao đến thấp</option>
              <option value="newest">Mới nhất</option>
            </select>
          </div>

          <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="animate-pulse">
              <div class="bg-gray-300 h-48 rounded-t-lg"></div>
              <div class="bg-white p-4 rounded-b-lg shadow-md">
                <div class="h-4 bg-gray-300 rounded mb-2"></div>
                <div class="h-3 bg-gray-300 rounded mb-3"></div>
                <div class="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
          <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
            <div class="text-6xl text-gray-400 mb-4">🔍</div>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">
              Không tìm thấy sản phẩm
            </h3>
            <p class="text-gray-500">
              Thử điều chỉnh bộ lọc để tìm thấy sản phẩm phù hợp
            </p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="product in paginatedProducts"
              :key="product.id"
              class="product-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div class="relative">
                <router-link :to="`/product/${product.id}`">
                  <img
                    :src="product.image"
                    :alt="product.name"
                    class="w-full h-48 object-cover rounded-t-lg"
                  />
                </router-link>
                <span
                  v-if="product.isNew"
                  class="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold"
                >
                  Mới
                </span>
                <span
                  v-if="product.discount"
                  class="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold"
                >
                  -{{ product.discount }}%
                </span>
              </div>
              <div class="p-4">
                <router-link :to="`/product/${product.id}`">
                  <h3 class="text-lg font-semibold text-gray-800 mb-2 hover:text-green-600 transition-colors">
                    {{ product.name }}
                  </h3>
                </router-link>
                <p class="text-sm text-gray-600 mb-3">
                  {{ product.Mota }}
                </p>
                <div class="flex items-center justify-between">
                  <div>
                    <span
                      v-if="product.originalPrice && product.originalPrice !== product.price"
                      class="text-sm text-gray-400 line-through mr-2"
                    >
                      {{ formatPrice(product.originalPrice) }}
                    </span>
                    <span class="text-xl font-bold text-orange-500">
                      {{ formatPrice(product.price) }}
                    </span>
                  </div>
                  <button
                    class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-semibold transition-colors"
                    @click="addToCart(product)"
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="totalPages > 1" class="flex justify-center mt-8">
            <nav class="flex space-x-2">
              <button
                v-for="page in totalPages"
                :key="page"
                :class="[
                  'px-4 py-2 rounded-md font-medium transition-colors',
                  page === currentPage
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                ]"
                @click="currentPage = page"
              >
                {{ page }}
              </button>
            </nav>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const loading = ref(true)
const currentPage = ref(1)
const itemsPerPage = 9
const sortBy = ref('name')

const filters = ref({
  search: '',
  category: '',
  minPrice: null,
  maxPrice: null,
  certifications: []
})

const categories = ref([
  { value: 'vegetables', label: 'Rau củ quả' },
  { value: 'fruits', label: 'Trái cây' },
  { value: 'grains', label: 'Ngũ cốc' },
  { value: 'spices', label: 'Gia vị' },
  { value: 'dried-goods', label: 'Đồ khô' },
  { value: 'processed', label: 'Chế biến' }
])

const certifications = ref([
  { value: 'organic', label: 'Hữu cơ' },
  { value: 'vegan', label: 'Thuần chay' },
  { value: 'gluten-free', label: 'Không gluten' },
  { value: 'non-gmo', label: 'Không biến đổi gen' }
])

const products = ref([
  {
    id: 1,
    name: 'Rau cải xanh hữu cơ',
    Mota: 'Rau cải xanh tươi ngon, không thuốc trừ sâu',
    price: 25000,
    originalPrice: null,
    image: '/images/products/cai-xanh.jpg',
    category: 'vegetables',
    isNew: true,
    discount: null,
    certifications: ['organic']
  },
  {
    id: 2,
    name: 'Táo Fuji hữu cơ',
    Mota: 'Táo Fuji ngọt ngào, giòn tan',
    price: 45000,
    originalPrice: 50000,
    image: '/images/products/tao-fuji.jpg',
    category: 'fruits',
    isNew: false,
    discount: 10,
    certifications: ['organic']
  },
])

const pageTitle = computed(() => {
  if (route.params.category) {
    const category = categories.value.find(c => c.value === route.params.category)
    return category ? category.label : 'Sản phẩm'
  }
  return 'Tất cả sản phẩm'
})

const filteredProducts = computed(() => {
  return products.value
})

const sortedProducts = computed(() => {
  const result = [...filteredProducts.value]

  switch (sortBy.value) {
    case 'price-asc':
      return result.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return result.sort((a, b) => b.price - a.price)
    case 'newest':
      return result.sort((a, b) => b.isNew - a.isNew)
    default:
      return result.sort((a, b) => a.name.localeCompare(b.name))
  }
})

const totalPages = computed(() => {
  return Math.ceil(sortedProducts.value.length / itemsPerPage)
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedProducts.value.slice(start, end)
})

const applyFilters = () => {
  currentPage.value = 1
}

const applySorting = () => {
  currentPage.value = 1
}

const clearFilters = () => {
  filters.value = {
    search: '',
    category: '',
    minPrice: null,
    maxPrice: null,
    certifications: []
  }
  currentPage.value = 1
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const addToCart = (product) => {
}

watch(() => route.params.category, () => {
  filters.value.category = ''
  currentPage.value = 1
})

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<style scoped>
.product-card:hover {
  transform: translateY(-2px);
  transition: transform 0.3s ease;
}
</style>
