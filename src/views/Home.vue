<template>
  <div class="home">
    <section class="hero-banner bg-green-50 py-16">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 class="text-4xl lg:text-5xl font-bold text-green-800 mb-4">
              Thực phẩm hữu cơ 100% tự nhiên
            </h1>
            <p class="text-lg text-gray-600 mb-6">
              Mang đến cho gia đình bạn những sản phẩm tươi ngon, an toàn và bổ dưỡng nhất từ thiên nhiên.
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <router-link
                to="/products"
                class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                Khám phá sản phẩm
              </router-link>
              <router-link
                to="/about"
                class="border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                Tìm hiểu thêm
              </router-link>
            </div>
          </div>
          <div>
            <img
              src="@/assets/banner.jpg"
              alt="Thực phẩm hữu cơ tươi ngon"
              class="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="categories py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">
          Danh mục sản phẩm
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            @click="goToCategory(category.slug)"
          >
            <div class="p-6 text-center">
              <div class="text-4xl mb-4">{{ category.icon }}</div>
              <h3 class="text-lg font-semibold text-gray-800 mb-2">
                {{ category.name }}
              </h3>
              <p class="text-sm text-gray-600">
                {{ category.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="featured-products py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">
          Sản phẩm nổi bật
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="product in Spnoibat"
            :key="product.id"
            class="product-card bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div class="relative">
              <img
                :src="product.image"
                :alt="product.name"
                class="w-full h-48 object-cover rounded-t-lg"
              />
              <span
                v-if="product.isNew"
                class="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold"
              >
                Mới
              </span>
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-800 mb-2">
                {{ product.name }}
              </h3>
              <p class="text-sm text-gray-600 mb-3">
                {{ product.description }}
              </p>
              <div class="flex items-center justify-between">
                <span class="text-xl font-bold text-orange-500">
                  {{ formatPrice(product.price) }}
                </span>
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
        <div class="text-center mt-8">
          <router-link
            to="/products"
            class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Xem tất cả sản phẩm
          </router-link>
        </div>
      </div>
    </section>

    <section class="commitments py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">
          Cam kết của chúng tôi
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="commitment in commitments"
            :key="commitment.id"
            class="text-center"
          >
            <div class="text-5xl text-green-600 mb-4">{{ commitment.icon }}</div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">
              {{ commitment.title }}
            </h3>
            <p class="text-gray-600">
              {{ commitment.description }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const categories = ref([
  {
    id: 1,
    name: 'Rau củ quả',
    slug: 'vegetables',
    icon: '🥬',
    description: 'Rau củ tươi ngon, an toàn'
  },
  {
    id: 2,
    name: 'Trái cây',
    slug: 'fruits',
    icon: '🍎',
    description: 'Trái cây ngọt ngào, bổ dưỡng'
  },
  {
    id: 3,
    name: 'Ngũ cốc',
    slug: 'grains',
    icon: '🌾',
    description: 'Ngũ cốc nguyên chất, dinh dưỡng'
  },
  {
    id: 4,
    name: 'Gia vị',
    slug: 'spices',
    icon: '🌿',
    description: 'Gia vị thơm ngon, tự nhiên'
  },
  {
    id: 5,
    name: 'Đồ khô',
    slug: 'dried-goods',
    icon: '🥜',
    description: 'Đồ khô chất lượng cao'
  },
  {
    id: 6,
    name: 'Chế biến',
    slug: 'processed',
    icon: '🍯',
    description: 'Sản phẩm chế biến hữu cơ'
  }
])

const Spnoibat = ref([
  {
    id: 1,
    name: 'Rau cải xanh hữu cơ',
    description: 'Rau cải xanh tươi ngon, không thuốc trừ sâu',
    price: 25000,
    image: '/images/products/cai-xanh.jpg',
    isNew: true
  },
  {
    id: 2,
    name: 'Táo Fuji hữu cơ',
    description: 'Táo Fuji ngọt ngào, giòn tan',
    price: 45000,
    image: '/images/products/tao-fuji.jpg',
    isNew: false
  },
  {
    id: 3,
    name: 'Gạo lứt đỏ hữu cơ',
    description: 'Gạo lứt đỏ bổ dưỡng, thơm ngon',
    price: 35000,
    image: '/images/products/gao-lut-do.jpg',
    isNew: true
  },
  {
    id: 4,
    name: 'Mật ong rừng nguyên chất',
    description: 'Mật ong rừng 100% nguyên chất',
    price: 120000,
    image: '/images/products/mat-ong.jpg',
    isNew: false
  }
])

const commitments = ref([
  {
    id: 1,
    icon: '✅',
    title: '100% Hữu cơ',
    description: 'Tất cả sản phẩm đều có chứng nhận hữu cơ'
  },
  {
    id: 2,
    icon: '🚚',
    title: 'Giao hàng nhanh',
    description: 'Giao hàng trong ngày tại khu vực nội thành'
  },
  {
    id: 3,
    icon: '💰',
    title: 'Hoàn tiền 100%',
    description: 'Hoàn tiền nếu không hài lòng về chất lượng'
  },
  {
    id: 4,
    icon: '🌱',
    title: 'Thân thiện môi trường',
    description: 'Bao bì có thể tái chế, bảo vệ môi trường'
  }
])

const goToCategory = (slug) => {
  router.push(`/products/category/${slug}`)
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const addToCart = (product) => {
  console.log('Aproduct', product)
}
</script>

<style scoped>
.category-card:hover {
  transform: translateY(-2px);
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  transition: transform 0.3s ease;
}
</style>
