<template>
  <div class="not-found min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full text-center px-4">
      <div class="mb-8">
        <div class="text-8xl mb-4">🌱</div>
        <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 class="text-2xl font-semibold text-gray-600 mb-4">
          Trang không tìm thấy
        </h2>
        <p class="text-gray-500 mb-8">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển đi.
        </p>
      </div>
      
      <div class="space-y-4">
        <router-link
          to="/"
          class="block w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Về trang chủ
        </router-link>
        
        <router-link
          to="/products"
          class="block w-full border border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Xem sản phẩm
        </router-link>
        
        <button
          @click="goBack"
          class="block w-full text-gray-600 hover:text-gray-800 px-6 py-3 font-semibold transition-colors"
        >
          ← Quay lại trang trước
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.not-found {
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="%23f9fafb"/><stop offset="100%" stop-color="%23f3f4f6"/></radialGradient></defs><rect width="100%" height="100%" fill="url(%23a)"/></svg>');
}
</style>
