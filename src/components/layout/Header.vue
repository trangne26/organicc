<template>
  <header class="header bg-white shadow-sm sticky top-0 z-50">
   <div class="bg-green-600 text-white py-2">
      <div class="container mx-auto px-4">
        <div class="flex flex-col sm:flex-row justify-between items-center text-sm">
          <div class="flex items-center space-x-4">
            <span> Hotline: 012345678</span>
            <span class="hidden md:inline">✉ info@organicstore.vn</span>
          </div>
          <div class="flex items-center space-x-4 mt-2 sm:mt-0">
            <span>Miễn phí vận chuyển đơn hàng từ 200k</span>
          </div>
        </div>
      </div>
    </div>
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <router-link to="/" class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <span class="text-white text-xl font-bold">🌱</span>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-800">Organic Store</h1>
            <p class="text-xs text-gray-600">Thực phẩm hữu cơ tự nhiên</p>
          </div>
        </router-link>
        <div class="hidden md:flex flex-1 max-w-lg mx-8">
          <div class="relative w-full">
            <input
              v-model="Tukhoa"
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              class="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              @keyup.enter="Timkiem"
            />
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
              <span class="text-gray-400">🔍</span>
            </div>
            <button
              @click="Timkiem"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Tìm
            </button>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative" v-click-outside="Dongmenu">
            <button
              @click="Momenu"
              class="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors"
            >
              <span class="text-xl">👤</span>
              <span class="hidden sm:inline">{{ isLoggedIn ? 'Tài khoản' : 'Đăng nhập' }}</span>
              <span class="text-sm">{{ Dangmomenu ? '▲' : '▼' }}</span>
            </button>
            <div
              v-show="Dangmomenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
              <template v-if="isLoggedIn">
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  @click="Dongmenu"
                >
                  👤 Thông tin cá nhân
                </router-link>
                <hr class="my-2">
                <button
                  @click="logout"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                   Đăng xuất
                </button>
              </template>
              <template v-else>
                <router-link
                  to="/login"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  @click="Dongmenu"
                >
                   Đăng nhập
                </router-link>
                <router-link
                  to="/register"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  @click="Dongmenu"
                >
                  Đăng ký
                </router-link>
              </template>
            </div>
          </div>
          <router-link
            to="/cart"
            class="relative flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors"
          >
            <div class="relative">
              <span class="text-xl">🛒</span>
              <span
                v-if="Soluongsp > 0"
                class="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold"
              >
                {{ Soluongsp }}
              </span>
            </div>
            <span class="hidden sm:inline">Giỏ hàng</span>
          </router-link>
          <button
            @click="toggleMobileMenu"
            class="md:hidden text-gray-700 hover:text-green-600 transition-colors"
          >
            <span class="text-xl">{{ mobileMenuOpen ? '✕' : '☰' }}</span>
          </button>
        </div>
      </div>
      <div class="md:hidden mt-4">
        <div class="relative">
          <input
            v-model="Tukhoa"
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            class="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            @keyup.enter="Timkiem"
          />
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
            <span class="text-gray-400"></span>
          </div>
          <button
            @click="Timkiem"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            Tìm
          </button>
        </div>
      </div>
    </div>
    <nav class="bg-green-600 text-white">
      <div class="container mx-auto px-4">
        <div class="hidden md:flex items-center justify-between py-3">
          <div class="flex items-center space-x-8">
            <router-link
              to="/products"
              class="flex items-center space-x-2 hover:text-green-200 transition-colors"
            >

              <span>Tất cả sản phẩm</span>
            </router-link>
            
            <div class="relative" v-click-outside="closeDanhmucMenu">
              <button
                @click="toggleDanhmucMenu"
                class="flex items-center space-x-2 hover:text-green-200 transition-colors"
              >

                <span>Danh mục</span>
                <span class="text-sm">{{ Modanhmuc ? '▲' : '▼' }}</span>
              </button>
              
              <div
                v-show="Modanhmuc"
                class="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
              >
                <router-link
                  v-for="category in Danhmuc"
                  :key="category.slug"
                  :to="`/products/category/${category.slug}`"
                  class="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  @click="closeDanhmucMenu"
                >
                  <span>{{ category.icon }}</span>
                  <span>{{ category.name }}</span>
                </router-link>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-6">
            <router-link
              to="/blog"
              class="hover:text-green-200 transition-colors"
            >
              Blog
            </router-link>
            <router-link
              to="/about"
              class="hover:text-green-200 transition-colors"
            >
              Giới thiệu
            </router-link>
            <router-link
              to="/contact"
              class="hover:text-green-200 transition-colors"
            >
              Liên hệ
            </router-link>
          </div>
        </div>
         <div
          v-show="mobileMenuOpen"
          class="md:hidden py-4 border-t border-green-500"
        >
          <div class="space-y-2">
            <router-link
              to="/products"
              class="block py-2 hover:text-green-200 transition-colors"
              @click="closeMobileMenu"
            >
              Tất cả sản phẩm
            </router-link>
            <div>
              <button
                @click="toggleMobileDanhmucMenu"
                class="flex items-center justify-between w-full py-2 hover:text-green-200 transition-colors"
              >
                <span> Danh mục</span>
                <span class="text-sm">{{ mobileModanhmuc ? '▲' : '▼' }}</span>
              </button>
              
              <div
                v-show="mobileModanhmuc"
                class="ml-4 mt-2 space-y-2"
              >
                <router-link
                  v-for="category in Danhmuc"
                  :key="category.slug"
                  :to="`/products/category/${category.slug}`"
                  class="flex items-center space-x-2 py-1 text-sm hover:text-green-200 transition-colors"
                  @click="closeMobileMenu"
                >
                  <span>{{ category.icon }}</span>
                  <span>{{ category.name }}</span>
                </router-link>
              </div>
            </div>
            <router-link
              to="/blog"
              class="block py-2 hover:text-green-200 transition-colors"
              @click="closeMobileMenu"
            >
              Blog
            </router-link>
            <router-link
              to="/about"
              class="block py-2 hover:text-green-200 transition-colors"
              @click="closeMobileMenu"
            >
              Giới thiệu
            </router-link>
            <router-link
              to="/contact"
              class="block py-2 hover:text-green-200 transition-colors"
              @click="closeMobileMenu"
            >
              Liên hệ
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const Tukhoa = ref('')
const Dangmomenu = ref(false)
const Modanhmuc = ref(false)
const mobileMenuOpen = ref(false)
const mobileModanhmuc = ref(false)

const isLoggedIn = computed(() => {
  return localStorage.getItem('authToken') !== null
})

const Soluongsp = ref(3)

const Danhmuc = ref([
  { name: 'Rau củ quả', slug: 'vegetables' },
  { name: 'Trái cây', slug: 'fruits'},
  { name: 'Ngũ cốc', slug: 'grains' },
  { name: 'Gia vị', slug: 'spices'},
  { name: 'Đồ khô', slug: 'dried-goods' },
  { name: 'Chế biến', slug: 'processed'}
])

const Timkiem = () => {
  if (Tukhoa.value.trim()) {
    router.push({
      path: '/products',
      query: { search: Tukhoa.value.trim() }
    })
    Tukhoa.value = ''
  }
}

const Momenu = () => {
  Dangmomenu.value = !Dangmomenu.value
  Modanhmuc.value = false
}

const Dongmenu = () => {
  Dangmomenu.value = false
}

const toggleDanhmucMenu = () => {
  Modanhmuc.value = !Modanhmuc.value
  Dangmomenu.value = false
}

const closeDanhmucMenu = () => {
  Modanhmuc.value = false
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  mobileModanhmuc.value = false
}

const toggleMobileDanhmucMenu = () => {
  mobileModanhmuc.value = !mobileModanhmuc.value
}

const logout = () => {
  localStorage.removeItem('authToken')
  Dongmenu()
  router.push('/')
}

const vClickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = function (event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>