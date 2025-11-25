<template>
  <div class="login">
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập tài khoản
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            <router-link
              to="/register"
              class="font-medium"
            >
              Hoặc tạo tài khoản mới
            </router-link>
          </p>
        </div>
        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email" class="sr-only">Email</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Địa chỉ email của bạn"
              />
            </div>
            <div>
              <label for="password" class="sr-only">Mật khẩu</label>
              <input
                v-model="form.password"
                type="password"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Mật khẩu"
              />
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                v-model="form.remember"
                type="checkbox"
                class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label class="ml-2 block text-sm text-gray-900">
                Ghi nhớ đăng nhập
              </label>
            </div>
            <div class="text-sm">
              <a href="#" class="font-medium text-green-600 hover:text-green-500">
                Quên mật khẩu?
              </a>
            </div>
          </div>
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {{ error }}
          </div>
          <div>
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  class="h-5 w-5 text-green-500 group-hover:text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login } from '@/api/auth'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { setAuth } = useAuth()

const form = ref({
  email: '',
  password: '',
  remember: false
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!form.value.email || !form.value.password) {
    error.value = 'Vui lòng nhập đầy đủ email và mật khẩu'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await login({
      email: form.value.email,
      password: form.value.password,
      remember: form.value.remember
    })

    // Xử lý response với cấu trúc { success, message, data: { user, token } }
    if (response.success && response.data) {
      // Sử dụng setAuth để cập nhật trạng thái authentication
      setAuth(response.data.user, response.data.token)

      // Hiển thị thông báo thành công (tùy chọn)
      console.log('Login success:', response.message)

      // Điều hướng dựa trên redirect query hoặc quyền admin
      const redirectPath = route.query.redirect
      
      if (redirectPath) {
        // Nếu có redirect query, điều hướng đến đó
        router.push(redirectPath)
      } else if (response.data.user.is_admin) {
        // Nếu là admin và không có redirect, điều hướng đến admin
        router.push('/admin')
      } else {
        // Nếu là user thường, điều hướng về trang chủ
        router.push('/')
      }
    } else {
      error.value = response.message || 'Đăng nhập thất bại'
    }
  } catch (err) {
    console.error('Login error:', err)
    error.value = err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login {
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="%23f0fdf4"/><stop offset="100%" stop-color="%23dcfce7"/></radialGradient></defs><rect width="100%" height="100%" fill="url(%23a)"/></svg>');
}
</style>
