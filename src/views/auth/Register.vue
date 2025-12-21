<template>
  <div class="register">
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div><h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Tạo tài khoản mới</h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            <router-link
              to="/login"
              class="font-medium"
            >
              Hoặc đăng nhập với tài khoản có sẵn
            </router-link>
          </p>
        </div>
        <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Họ và tên
              </label>
              <input
                v-model="form.fullName"
                type="text"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Nhập họ và tên"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Nhập địa chỉ email"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              <input
                v-model="form.phone"
                type="tel"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Địa chỉ
              </label>
              <input
                v-model="form.address"
                type="text"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <input
                v-model="form.password"
                type="password"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Nhập mật khẩu"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Xác nhận mật khẩu
              </label>
              <input
                v-model="form.confirmPassword"
                type="password"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Nhập lại mật khẩu"
              />
            </div>
          </div>
           <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {{ error }}
          </div>
          <div v-if="validationErrors && Object.keys(validationErrors).length > 0" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            <ul class="list-disc list-inside space-y-1">
              <li v-for="(errors, field) in validationErrors" :key="field">
                <span class="font-medium">{{ getFieldLabel(field) }}:</span>
                <span v-for="(err, index) in errors" :key="index">{{ err }}<span v-if="index < errors.length - 1">, </span></span>
              </li>
            </ul>
          </div>
          <div>
            <button
              type="submit"
              :disabled="loading || !isFormValid"
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
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
              {{ loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/auth'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { setAuth } = useAuth()

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')
const validationErrors = ref({})

const isFormValid = computed(() => {
  return (
    form.value.fullName.trim() &&
    form.value.email.trim() &&
    form.value.phone.trim() &&
    form.value.address.trim() &&
    form.value.password.length >= 6 &&
    form.value.password === form.value.confirmPassword
  )
})

const getFieldLabel = (field) => {
  const labels = {
    name: 'Họ và tên',
    email: 'Email',
    phone: 'Số điện thoại',
    address: 'Địa chỉ',
    password: 'Mật khẩu',
    password_confirmation: 'Xác nhận mật khẩu'
  }
  return labels[field] || field
}

const handleRegister = async () => {
  if (!isFormValid.value) {
    error.value = 'Vui lòng điền đầy đủ thông tin và đảm bảo mật khẩu khớp nhau'
    return
  }

  loading.value = true
  error.value = ''
  validationErrors.value = {}

  try {
    const response = await register({
      name: form.value.fullName,
      email: form.value.email,
      phone: form.value.phone,
      address: form.value.address,
      password: form.value.password,
      password_confirmation: form.value.confirmPassword
    })

    if (response.success && response.data) {
      setAuth(response.data.user, response.data.token)

      if (response.data.user.is_admin) {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } else {
      error.value = response.message || 'Đăng ký thất bại'
    }
  } catch (err) {
    console.error('Register error:', err)
    
    if (err.payload?.errors) {
      validationErrors.value = err.payload.errors
    }
    
    error.value = err.message || err.payload?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register {
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="%23f0fdf4"/><stop offset="100%" stop-color="%23dcfce7"/></radialGradient></defs><rect width="100%" height="100%" fill="url(%23a)"/></svg>');
}
</style>
