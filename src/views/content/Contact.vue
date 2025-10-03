<template>
  <div class="contact">
    <section class="page-header bg-green-50 py-12">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-800 mb-4">Liên hệ với chúng tôi</h1>
          <p class="text-gray-600">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </p>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">

        <div class="bg-white rounded-lg shadow-md p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Gửi tin nhắn cho chúng tôi</h2>

          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                    v-model="form.fullName"
                    type="text"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                    v-model="form.email"
                    type="email"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nhập email"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                  v-model="form.phone"
                  type="tel"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nhập số điện thoại"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Chủ đề *
              </label>
              <select
                  v-model="form.subject"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Chọn chủ đề</option>
                <option value="general">Thông tin chung</option>
                <option value="product">Sản phẩm</option>
                <option value="order">Đơn hàng</option>
                <option value="partnership">Hợp tác</option>
                <option value="complaint">Khiếu nại</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tin nhắn *
              </label>
              <textarea
                  v-model="form.message"
                  rows="6"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Nhập tin nhắn của bạn..."
              ></textarea>
            </div>

            <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
              {{ successMessage }}
            </div>

            <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {{ errorMessage }}
            </div>

            <button
                type="submit"
                :disabled="submitting"
                class="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ submitting ? 'Đang gửi...' : 'Gửi tin nhắn' }}
            </button>
          </form>
        </div>

        <div class="space-y-8">
          <div class="bg-white rounded-lg shadow-md p-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Thông tin liên hệ</h2>

            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span class="text-green-600 text-lg">📍</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800 mb-1">Địa chỉ</h3>
                  <p class="text-gray-600">
                    123 Đường Nguyễn Văn Cừ, Phường 4<br>
                    Quận 5, TP. Hồ Chí Minh
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span class="text-green-600 text-lg">📞</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800 mb-1">Điện thoại</h3>
                  <p class="text-gray-600">
                    <a href="tel:+84901234567" class="hover:text-green-600">+84 901 234 567</a><br>
                    <a href="tel:+84901234568" class="hover:text-green-600">+84 901 234 568</a>
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span class="text-green-600 text-lg">✉️</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800 mb-1">Email</h3>
                  <p class="text-gray-600">
                    <a href="mailto:info@organicstore.vn" class="hover:text-green-600">info@organicstore.vn</a><br>
                    <a href="mailto:support@organicstore.vn" class="hover:text-green-600">support@organicstore.vn</a>
                  </p>
                </div>
              </div>

              <div class="flex items-start space-x-4">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span class="text-green-600 text-lg">🕒</span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800 mb-1">Giờ làm việc</h3>
                  <p class="text-gray-600">
                    Thứ 2 - Thứ 6: 8:00 - 18:00<br>
                    Thứ 7: 8:00 - 17:00<br>
                    Chủ nhật: 9:00 - 16:00
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-green-50 rounded-lg p-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Câu hỏi thường gặp</h2>

            <div class="space-y-4">
              <div>
                <h3 class="font-semibold text-gray-800 mb-2">Làm thế nào để đặt hàng?</h3>
                <p class="text-gray-600 text-sm">
                  Bạn có thể đặt hàng trực tuyến qua website hoặc gọi điện thoại đến hotline của chúng tôi.
                </p>
              </div>

              <div>
                <h3 class="font-semibold text-gray-800 mb-2">Thời gian giao hàng?</h3>
                <p class="text-gray-600 text-sm">
                  Thời gian giao hàng từ 2-3 ngày làm việc tại TP.HCM và các tỉnh lân cận.
                </p>
              </div>

              <div>
                <h3 class="font-semibold text-gray-800 mb-2">Chính sách đổi trả?</h3>
                <p class="text-gray-600 text-sm">
                  Chúng tôi hỗ trợ đổi trả trong vòng 7 ngày nếu sản phẩm không đạt chất lượng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-12">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800 mb-4">Hệ thống cửa hàng</h2>
          <p class="text-gray-600">Ghé thăm các cửa hàng của chúng tôi</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
              v-for="store in stores"
              :key="store.id"
              class="bg-white rounded-lg shadow-md p-6"
          >
            <h3 class="text-lg font-semibold text-gray-800 mb-3">{{ store.name }}</h3>
            <div class="space-y-2 text-sm text-gray-600">
              <div class="flex items-start space-x-2">
                <span>📍</span>
                <span>{{ store.address }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span>📞</span>
                <a :href="`tel:${store.phone}`" class="hover:text-green-600">{{ store.phone }}</a>
              </div>
              <div class="flex items-start space-x-2">
                <span>🕒</span>
                <span>{{ store.hours }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const submitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const stores = ref([
  {
    id: 1,
    name: 'Organic Store - Chi nhánh 1',
    address: '123 Đường Nguyễn Văn Cừ, P.4, Q.5, TP.HCM',
    phone: '+84 901 234 567',
    hours: 'T2-T6: 8:00-18:00, T7: 8:00-17:00, CN: 9:00-16:00'
  },
  {
    id: 2,
    name: 'Organic Store - Chi nhánh 2',
    address: '456 Đường Lê Văn Việt, P.Tăng Nhơn Phú A, Q.9, TP.HCM',
    phone: '+84 901 234 568',
    hours: 'T2-T6: 8:00-18:00, T7: 8:00-17:00, CN: 9:00-16:00'
  },
  {
    id: 3,
    name: 'Organic Store - Chi nhánh 3',
    address: '789 Đường Võ Văn Ngân, P.Bình Thọ, Q.Thủ Đức, TP.HCM',
    phone: '+84 901 234 569',
    hours: 'T2-T6: 8:00-18:00, T7: 8:00-17:00, CN: 9:00-16:00'
  }
])

const submitForm = async () => {
  submitting.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          resolve()
        } else {
          reject(new Error('Có lỗi xảy ra, vui lòng thử lại sau'))
        }
      }, 2000)
    })

    successMessage.value = 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24 giờ.'

    form.value = {
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }

  } catch (error) {
    errorMessage.value = error.message
  } finally {
    submitting.value = false
  }
}
</script>