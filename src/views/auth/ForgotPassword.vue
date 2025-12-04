<template>
  <div class="forgot-password">
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 relative z-10">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Quên mật khẩu?
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn một liên kết để đặt lại mật khẩu.
          </p>
          <p class="mt-2 text-center text-sm text-gray-600">
            <router-link
              to="/login"
              class="font-medium text-green-600 hover:text-green-500"
            >
              Quay lại đăng nhập
            </router-link>
          </p>
        </div>
        <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
          <div class="rounded-md shadow-sm">
            <div>
              <label for="email" class="sr-only">Email </label>
              <input
                ref="emailInput"
                id="email"
                v-model="email"
                type="email"
                required
                autocomplete="email"
                tabindex="1"
                class="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm bg-white"
                placeholder="Địa chỉ email của bạn"
              />
            </div>
          </div>
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {{ error }}
          </div>
          <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {{ success }}
          </div>
          <div>
            <button
              type="submit"
              :disabled="!email"
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
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </span>
              <span v-if="loading">Đang gửi...</span>
              <span v-else-if="success">Đã gửi</span>
              <span v-else>Gửi liên kết đặt lại mật khẩu</span>
            </button>
          </div>
          <div v-if="success" class="text-center">
            <p class="text-sm text-gray-600">
              Không nhận được email?
              <button
                type="button"
                @click="handleResend"
                class="font-medium text-green-600 hover:text-green-500"
              >
                Gửi lại
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { forgotPassword } from '@/api/auth'
import { useNotification } from '@/composables/useNotification'

const { showSuccess, showError } = useNotification()

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')
const emailInput = ref(null)

onMounted(() => {
  nextTick(() => {
    if (emailInput.value && !loading.value && !success.value) {
      emailInput.value.focus()
    }
  })
})

const handleSubmit = async () => {
  if (!email.value) {
    error.value = 'Vui lòng nhập địa chỉ email'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await forgotPassword({ email: email.value })
    
    if (response.success) {
      success.value = response.message || 'Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư.'
      showSuccess('Email đặt lại mật khẩu đã được gửi thành công')
    } else {
      error.value = response.message || 'Không thể gửi email. Vui lòng thử lại sau.'
      showError(response.message || 'Gửi email thất bại')
    }
  } catch (err) {
    console.error('Forgot password error:', err)
    error.value = err.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.'
    showError(err.message || 'Gửi email thất bại')
  } finally {
    loading.value = false
  }
}

const handleResend = () => {
  success.value = ''
  error.value = ''
  handleSubmit()
}
</script>

<style scoped>
.forgot-password {
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="%23f0fdf4"/><stop offset="100%" stop-color="%23dcfce7"/></radialGradient></defs><rect width="100%" height="100%" fill="url(%23a)"/></svg>');
}

input[type="email"]:not(:disabled) {
  cursor: text;
  pointer-events: auto;
  touch-action: manipulation;
}

input[type="email"]:disabled {
  cursor: not-allowed;
}
</style>

