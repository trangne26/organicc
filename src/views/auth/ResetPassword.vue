<template>
  <div class="reset-password">
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 relative z-10">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đặt lại mật khẩu
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Nhập mật khẩu mới của bạn
          </p>
        </div>
        <form class="mt-8 space-y-6" @submit.prevent="handleReset">
          <div class="rounded-md space-y-4">
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới
              </label>
              <input
                ref="passwordInput"
                id="password"
                v-model="form.password"
                type="password"
                required
                autocomplete="new-password"
                minlength="6"
                tabindex="1"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white"
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
              />
            </div>
            <div>
              <label for="password_confirmation" class="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu
              </label>
              <input
                ref="passwordConfirmationInput"
                id="password_confirmation"
                v-model="form.password_confirmation"
                type="password"
                required
                autocomplete="new-password"
                minlength="6"
                tabindex="2"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
          </div>
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {{ error }}
          </div>
          <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {{ successMessage }}
          </div>
          <div>
            <button
              type="submit"
              :disabled="loading || !!successMessage"
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
              <span v-if="loading">Đang đặt lại...</span>
              <span v-else-if="successMessage">Đã đặt lại mật khẩu</span>
              <span v-else>Đặt lại mật khẩu</span>
            </button>
          </div>
          <div v-if="successMessage" class="text-center">
            <router-link
              to="/login"
              class="font-medium text-green-600 hover:text-green-500"
            >
              Đăng nhập ngay
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { resetPassword } from '@/api/auth'
import { useNotification } from '@/composables/useNotification'

const router = useRouter()
const route = useRoute()
const { showSuccess, showError } = useNotification()

const form = ref({
  password: '',
  password_confirmation: ''
})

const loading = ref(false)
const error = ref('')
const success = ref(false)
const successMessage = ref('')
const token = ref('')
const passwordInput = ref(null)
const passwordConfirmationInput = ref(null)

onMounted(() => {
  // Get token from query parameter
  token.value = route.query.token || route.params.token || ''
  
  if (!token.value) {
    error.value = 'Liên kết đặt lại mật khẩu không hợp lệ. Vui lòng kiểm tra lại email.'
    showError('Token không hợp lệ')
    return
  }

  // Auto focus on first input when component is mounted
  nextTick(() => {
    if (passwordInput.value && !loading.value && !successMessage.value) {
      passwordInput.value.focus()
    }
  })
})

const handleReset = async () => {
  if (!token.value) {
    error.value = 'Liên kết đặt lại mật khẩu không hợp lệ.'
    return
  }

  if (!form.value.password || !form.value.password_confirmation) {
    error.value = 'Vui lòng nhập đầy đủ mật khẩu mới và xác nhận mật khẩu'
    return
  }

  if (form.value.password.length < 6) {
    error.value = 'Mật khẩu phải có ít nhất 6 ký tự'
    return
  }

  if (form.value.password !== form.value.password_confirmation) {
    error.value = 'Mật khẩu xác nhận không khớp'
    return
  }

  loading.value = true
  error.value = ''
  successMessage.value = ''
  success.value = false

  try {
    const response = await resetPassword({
      token: token.value,
      password: form.value.password
    })

    if (response.success) {
      success.value = true
      successMessage.value = response.message || 'Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập với mật khẩu mới.'
      showSuccess('Đặt lại mật khẩu thành công')
      
      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } else {
      error.value = response.message || 'Đặt lại mật khẩu thất bại. Token có thể đã hết hạn.'
      showError(response.message || 'Đặt lại mật khẩu thất bại')
    }
  } catch (err) {
    console.error('Reset password error:', err)
    error.value = err.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại sau hoặc yêu cầu liên kết mới.'
    showError(err.message || 'Đặt lại mật khẩu thất bại')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
input[type="password"]:not(:disabled) {
  cursor: text;
  pointer-events: auto;
  touch-action: manipulation;
}

input[type="password"]:disabled {
  cursor: not-allowed;
}
</style>

