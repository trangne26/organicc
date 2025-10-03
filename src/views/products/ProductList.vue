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
              />
            </div>
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </label>
              <select
                v-model="filters.category_id"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Tất cả danh mục</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
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
                    v-model="filters.min_price"
                    type="number"
                    placeholder="Từ"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div class="flex items-center">
                  <input
                    v-model="filters.max_price"
                    type="number"
                    placeholder="Đến"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
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
              Hiển thị {{ totalItems }} sản phẩm
            </p>
            <select
              v-model="sortBy"
              class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Sắp xếp mặc định</option>
              <option value="asc">Giá: Thấp đến cao</option>
              <option value="desc">Giá: Cao đến thấp</option>
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
          <div v-else-if="products.length === 0" class="text-center py-12">
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
              v-for="product in products"
              :key="product.id"
              class="product-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div class="relative">
                <router-link :to="`/product/${product.id}`">
                  <img
                    :src="getPrimaryImage(product)"
                    :alt="product.name"
                    class="w-full h-48 object-cover rounded-t-lg"
                    @error="handleImageError"
                  />
                </router-link>
              </div>
              <div class="p-4">
                <router-link :to="`/product/${product.id}`">
                  <h3 class="text-lg font-semibold text-gray-800 mb-2 hover:text-green-600 transition-colors">
                    {{ product.name }}
                  </h3>
                </router-link>
                <p class="text-sm text-gray-600 mb-3">
                  {{ product.description }}
                </p>
                <div class="flex items-center justify-between">
                  <div>
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
                @click="goToPage(page)"
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
import { listProducts } from '@/api/products'
import { useProductImage } from '@/composables/useProductImage'
import { listCategories } from '@/api/categories'

const route = useRoute()
const { getPrimaryImage, formatPrice, handleImageError } = useProductImage()

const loading = ref(true)
const currentPage = ref(1)
const itemsPerPage = ref(15)
const sortBy = ref('')
const totalItems = ref(0)
const totalPages = ref(0)

const filters = ref({
  search: '',
  category_id: '',
  min_price: null,
  max_price: null,
  active: true
})

const categories = ref([])
const products = ref([])

const pageTitle = computed(() => {
  if (route.params.category) {
    const categoryId = parseInt(route.params.category)
    const category = categories.value.find(c => c.id === categoryId)
    return category ? category.name : 'Sản phẩm'
  }
  return 'Tất cả sản phẩm'
})

// Fetch products from API
const fetchProducts = async () => {
  try {
    loading.value = true
    
    const params = {
      page: currentPage.value,
      per_page: itemsPerPage.value,
      active: filters.value.active
    }

    // Add filters if they have values
    if (filters.value.search) params.search = filters.value.search
    if (filters.value.category_id) params.category_id = filters.value.category_id
    if (filters.value.min_price) params.min_price = filters.value.min_price
    if (filters.value.max_price) params.max_price = filters.value.max_price
    if (sortBy.value) params.sort_price = sortBy.value

    const response = await listProducts(params)
    
    if (response.success) {
      products.value = response.data || []
      totalItems.value = response.meta?.total || 0
      totalPages.value = response.meta?.last_page || 1
    } else {
      console.error('Failed to fetch products:', response.message)
      products.value = []
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    products.value = []
  } finally {
    loading.value = false
  }
}

// Fetch categories from API
const fetchCategories = async () => {
  try {
    const response = await listCategories()
    if (response.success) {
      categories.value = response.data || []
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    categories.value = []
  }
}


const clearFilters = () => {
  filters.value = {
    search: '',
    category_id: '',
    min_price: null,
    max_price: null,
    active: true
  }
  sortBy.value = ''
  currentPage.value = 1
  fetchProducts()
}

const goToPage = (page) => {
  currentPage.value = page
  fetchProducts()
}


const addToCart = (product) => {
  // TODO: Implement add to cart functionality
}

// Watch for route changes
watch(() => route.params.category, (newCategory) => {
  if (newCategory) {
    filters.value.category_id = parseInt(newCategory)
  } else {
    filters.value.category_id = ''
  }
  currentPage.value = 1
  fetchProducts()
}, { immediate: true })

// Watch for query parameter changes (search)
watch(() => route.query.search, (newSearch) => {
  if (newSearch) {
    filters.value.search = decodeURIComponent(newSearch)
  } else {
    filters.value.search = ''
  }
  currentPage.value = 1
  fetchProducts()
}, { immediate: true })

// Watch for filter changes with debounce
let filterTimeout = null
watch(filters, () => {
  if (filterTimeout) clearTimeout(filterTimeout)
  filterTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchProducts()
  }, 500)
}, { deep: true })

// Watch for sorting changes
watch(sortBy, () => {
  currentPage.value = 1
  fetchProducts()
})

onMounted(async () => {
  await fetchCategories()
  // fetchProducts() will be called by the route watcher with immediate: true
})
</script>

<style scoped>
.product-card:hover {
  transform: translateY(-2px);
  transition: transform 0.3s ease;
}
</style>
