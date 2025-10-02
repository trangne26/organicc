<template>
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo bên trái -->
        <router-link to="/admin" class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <span class="text-white text-xl font-bold">🌱</span>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-800">Organic Store</h1>
            <p class="text-xs text-gray-600">Quản trị hệ thống</p>
          </div>
        </router-link>

        <!-- Thông tin tài khoản bên phải -->
        <div class="flex items-center space-x-4">
          <!-- Thông báo -->
          <button class="relative p-2 text-gray-600 hover:text-green-600 transition-colors">
            <span class="text-xl">🔔</span>
            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>

          <!-- Menu tài khoản -->
          <div class="relative" v-click-outside="closeAccountMenu">
            <button
              @click="toggleAccountMenu"
              class="flex items-center space-x-3 text-gray-700 hover:text-green-600 transition-colors"
            >
              <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span class="text-green-600 font-semibold text-sm">A</span>
              </div>
              <div class="hidden sm:block text-left">
                <p class="text-sm font-medium text-gray-800">Admin User</p>
                <p class="text-xs text-gray-500">Quản trị viên</p>
              </div>
              <span class="text-sm text-gray-400">{{ isAccountMenuOpen ? '▲' : '▼' }}</span>
            </button>

            <!-- Dropdown menu -->
            <div
              v-show="isAccountMenuOpen"
              class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
            >
              <div class="px-4 py-3 border-b border-gray-100">
                <p class="text-sm font-medium text-gray-800">Admin User</p>
                <p class="text-xs text-gray-500">admin@organicstore.vn</p>
              </div>
              
              <router-link
                to="/admin/profile"
                class="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                @click="closeAccountMenu"
              >
                <span class="text-lg">👤</span>
                <span>Thông tin cá nhân</span>
              </router-link>
              
              <router-link
                to="/admin/settings"
                class="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                @click="closeAccountMenu"
              >
                <span class="text-lg">⚙️</span>
                <span>Cài đặt</span>
              </router-link>
              
              <hr class="my-2">
              
              <router-link
                to="/"
                class="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                @click="closeAccountMenu"
              >
                <span class="text-lg">🏠</span>
                <span>Về trang chủ</span>
              </router-link>
              
              <button
                @click="logout"
                class="flex items-center space-x-3 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <span class="text-lg">🚪</span>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isAccountMenuOpen = ref(false)

const toggleAccountMenu = () => {
  isAccountMenuOpen.value = !isAccountMenuOpen.value
}

const closeAccountMenu = () => {
  isAccountMenuOpen.value = false
}

const logout = () => {
  localStorage.removeItem('authToken')
  closeAccountMenu()
  router.push('/login')
}

// Click outside directive
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

<style scoped>
/* Admin header specific styles */
</style>
