<template>
  <footer class="footer bg-gray-800 text-white">
    <div class="container mx-auto px-4 py-12"><div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
       <div>
          <div class="flex items-center space-x-3 mb-6">
            <div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span class="text-white text-xl font-bold"></span>
            </div>
            <div>
              <h3 class="text-xl font-bold">Organic Store</h3>
              <p class="text-sm text-gray-300">Thực phẩm hữu cơ tự nhiên</p>
            </div>
          </div>
          <p class="text-gray-300 text-sm mb-4 leading-relaxed">
            Chúng tôi cam kết mang đến cho bạn những sản phẩm thực phẩm hữu cơ 
            tươi ngon, an toàn và bổ dưỡng nhất từ các nông trại địa phương.
          </p>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-6">Liên kết nhanh</h4>
          <ul class="space-y-3">
            <li>
              <router-link
                to="/about"
                class="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Giới thiệu
              </router-link>
            </li>
            <li>
              <router-link
                to="/products"
                class="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Sản phẩm
              </router-link>
            </li>
            <li>
              <router-link
                to="/blog"
                class="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Blog
              </router-link>
            </li>
            <li>
              <router-link
                to="/contact"
                class="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Liên hệ
              </router-link>
            </li>
            <li>
              <a href="#" class="text-gray-300 hover:text-white transition-colors text-sm">
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a href="#" class="text-gray-300 hover:text-white transition-colors text-sm">
                Điều khoản sử dụng
              </a>
            </li>
          </ul>
        </div>
       <div>
          <h4 class="text-lg font-semibold mb-6">Danh mục sản phẩm</h4>
          <div v-if="categoriesLoading" class="space-y-3">
            <div v-for="i in 6" :key="i" class="animate-pulse">
              <div class="h-4 bg-gray-600 rounded w-3/4"></div>
            </div>
          </div>
          <ul v-else-if="categories.length > 0" class="space-y-3">
            <li v-for="category in categories" :key="category.slug">
              <router-link
                :to="`/products/category/${category.id}`"
                class="text-gray-300 hover:text-white transition-colors text-sm flex items-center space-x-2"
              >
                <span v-if="category.icon">{{ category.icon }}</span>
                <span>{{ category.name }}</span>
              </router-link>
            </li>
          </ul>
          <div v-else class="text-gray-400 text-sm">
            Không có danh mục nào
          </div>
        </div>
        <div>
          <h4 class="text-lg font-semibold mb-6">Thông tin liên hệ</h4>
        <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <span class="text-green-400 mt-1"></span>
              <div>
                <p class="text-sm text-gray-300 mt-1">
                  123 Đường Cầu Giấy <br>
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-green-400"></span>
              <div>
                <a
                  href="012345678"
                  class="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  012345678
                </a>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-green-400"></span>
              <div>
                <a
                  href="mailto:info@organicstore.vn"
                  class="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  info@organicstore.vn
                </a>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <span class="text-green-400 mt-1"></span>
              <div>
                <p class="text-sm text-gray-300 mt-1">
                  9:00 - 22:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-gray-700 py-8">
      <div class="container mx-auto px-4">
        <div class="text-center mb-6">
          <h3 class="text-xl font-semibold mb-2">Đăng ký nhận tin tức</h3>
          <p class="text-gray-300 text-sm">
            Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
          </p>
        </div>
        <form @submit.prevent="Guiemail" class="max-w-md mx-auto ">
          <div class="flex">
            <input
              v-model="Emaildki"
              type="email"
              placeholder="Nhập email của bạn"
              required
              class="flex-1 px-4 py-2 rounded-l-lg border-0 focus:ring-2 focus:ring-green-500 text-gray-900 placeholder:text-green-500"
            />
            <button
              type="submit"
              :disabled="Dangui"
              class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-r-lg font-semibold transition-colors disabled:opacity-50"
            >
              {{ Dangui ? 'Đang gửi...' : 'Đăng ký' }}
            </button>
          </div>
          <p v-if="Tbao" class="text-center text-sm mt-2" :class="Tbao.type === 'success' ? 'text-green-400' : 'text-red-400'">
            {{ Tbao.text }}
          </p>
        </form>
      </div>
    </div>
    <div class="bg-gray-700 border-t border-gray-600 py-6">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <h4 class="text-sm font-semibold text-gray-300 mb-4">Phương thức thanh toán</h4>
          <div class="flex justify-center items-center space-x-6 flex-wrap">
            <div class="flex items-center space-x-2 text-gray-300">
              <span class="text-sm">Tiền mặt</span>
            </div>
            <div class="flex items-center space-x-2 text-gray-300">
              <span class="text-sm">Chuyển khoản</span>
            </div>
            <div class="flex items-center space-x-2 text-gray-300">
              <span class="text-sm">MoMo</span>
            </div>
            <div class="flex items-center space-x-2 text-gray-300">
              <span class="text-sm">ZaloPay</span>
            </div>
            <div class="flex items-center space-x-2 text-gray-300">
              <span class="text-sm">VNPay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-gray-700 border-t border-gray-600 py-6">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <h4 class="text-sm font-semibold text-gray-300 mb-4">Chứng nhận & Cam kết</h4>
          <div class="flex justify-center items-center space-x-8 flex-wrap">
            <div class="flex items-center space-x-2 text-gray-300">
              <span class="text-xs">100% Hữu cơ</span>
            </div>
            <div class="flex items-center space-x-2 text-gray-300">
              <span class="text-xs">An toàn thực phẩm</span>
            </div>
            <div class="flex items-center space-x-2 text-gray-300">
              <span class="text-xs">Thân thiện môi trường</span>
            </div>
            <div class="flex items-center space-x-2 text-gray-300">
              <span class="text-xs">Chất lượng đảm bảo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bg-gray-900 py-4">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center space-x-4 mt-2 md:mt-0">
            <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">
              Chính sách bảo mật
            </a>
            <span class="text-gray-600">|</span>
            <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">
              Điều khoản dịch vụ
            </a>
            <span class="text-gray-600">|</span>
            <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">
              Hỗ trợ
            </a>
          </div>
        </div>
      </div>
    </div>
    <button
      v-show="showBackToTop"
      @click="scrollToTop"
      class="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-40"
      aria-label="Lên đầu trang"
    >
      <span class="text-lg">⬆️</span>
    </button>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useCategories } from '@/composables/useCategories'

const Emaildki = ref('')
const Dangui = ref(false)
const Tbao = ref(null)
const showBackToTop = ref(false)

// Sử dụng composable để lấy dữ liệu categories từ API
const { categories, loading: categoriesLoading, fetchCategories } = useCategories()

const Guiemail = async () => {
  Dangui.value = true
  Tbao.value = null

  Tbao.value = {
    type: 'success',
    text: 'Đăng ký thành công! Cảm ơn bạn đã quan tâm.'
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  // Tải danh mục sản phẩm từ API khi component được mount
  try {
    await fetchCategories()
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.footer a:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}
</style>
