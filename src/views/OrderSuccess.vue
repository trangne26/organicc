<template>
  <div class="order-success">
    <section class="page-header bg-green-50 py-12">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-800 mb-4">Đặt hàng thành công!</h1>
          <p class="text-gray-600">
            Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi
          </p>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-8">
          <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Đơn hàng đã được xác nhận!</h2>
          <p class="text-gray-600">
            Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận đơn hàng.
          </p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Thông tin đơn hàng</h3>
          
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Mã đơn hàng:</span>
              <span class="font-semibold text-gray-800">#{{ orderData?.order_id || orderId }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Ngày đặt hàng:</span>
              <span class="font-semibold text-gray-800">{{ formatDate(orderData?.created_at || orderDate) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Tạm tính:</span>
              <span class="font-semibold text-gray-800">{{ formatPrice(orderData?.subtotal || 0) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Phí vận chuyển:</span>
              <span class="font-semibold text-gray-800">
                {{ orderData?.delivery_fee > 0 ? formatPrice(orderData.delivery_fee) : 'Miễn phí' }}
              </span>
            </div>
            <div v-if="orderData?.discount > 0" class="flex justify-between text-green-600">
              <span>Giảm giá:</span>
              <span class="font-semibold">-{{ formatPrice(orderData.discount) }}</span>
            </div>
            <hr class="border-gray-200" />
            <div class="flex justify-between text-lg font-bold">
              <span>Tổng cộng:</span>
              <span class="text-orange-500">{{ formatPrice(orderData?.total || orderTotal) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Phương thức thanh toán:</span>
              <span class="font-semibold text-gray-800">{{ paymentMethodName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Phương thức giao hàng:</span>
              <span class="font-semibold text-gray-800">{{ deliveryMethodName }}</span>
            </div>
          </div>
        </div>

        <div v-if="orderData?.shipping_info" class="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Thông tin giao hàng</h3>
          
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Họ và tên:</span>
              <span class="font-semibold text-gray-800">{{ orderData.shipping_info.fullName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Số điện thoại:</span>
              <span class="font-semibold text-gray-800">{{ orderData.shipping_info.phone }}</span>
            </div>
            <div v-if="orderData.shipping_info.email" class="flex justify-between">
              <span class="text-gray-600">Email:</span>
              <span class="font-semibold text-gray-800">{{ orderData.shipping_info.email }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Địa chỉ:</span>
              <span class="font-semibold text-gray-800">{{ orderData.shipping_info.address }}</span>
            </div>
            <div v-if="orderData.shipping_info.notes" class="flex justify-between">
              <span class="text-gray-600">Ghi chú:</span>
              <span class="font-semibold text-gray-800">{{ orderData.shipping_info.notes }}</span>
            </div>
          </div>
        </div>

        <div v-if="orderData?.items && orderData.items.length > 0" class="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Sản phẩm đã đặt</h3>
          
          <div class="space-y-4">
            <div
              v-for="item in orderData.items"
              :key="item.id"
              class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <img
                :src="getPrimaryImage(item)"
                :alt="item.name"
                class="w-12 h-12 object-cover rounded-lg"
              />
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-semibold text-gray-800 truncate">
                  {{ item.name }}
                </h4>
                <p class="text-xs text-gray-600">
                  {{ formatPrice(item.price) }} x {{ item.quantity }}
                </p>
              </div>
              <span class="text-sm font-semibold text-gray-800">
                {{ formatPrice(item.price * item.quantity) }}
              </span>
            </div>
          </div>
        </div>

        <div class="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 class="text-lg font-semibold text-blue-800 mb-3">Bước tiếp theo</h3>
          <div class="space-y-2 text-blue-700">
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Chúng tôi sẽ gọi điện xác nhận đơn hàng trong vòng 30 phút</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Đơn hàng sẽ được chuẩn bị và giao trong 2-3 ngày làm việc</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Bạn sẽ nhận được tin nhắn SMS khi đơn hàng được giao</span>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Thông tin liên hệ</h3>
          <div class="space-y-2 text-gray-600">
            <p><strong>Hotline:</strong> 1900 1234</p>
            <p><strong>Email:</strong> support@organicc.com</p>
            <p><strong>Thời gian hỗ trợ:</strong> 8:00 - 22:00 (Thứ 2 - Chủ nhật)</p>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/products"
            class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-center"
          >
            Tiếp tục mua sắm
          </router-link>
          <router-link
            to="/"
            class="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-center"
          >
            Về trang chủ
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductImage } from '@/composables/useProductImage'

const route = useRoute()
const { getPrimaryImage } = useProductImage()

const orderData = ref(null)

const orderId = ref('')
const orderDate = ref(new Date())
const orderTotal = ref(0)
const paymentMethodName = ref('')
const deliveryMethodName = ref('')

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

const getPaymentMethodName = (method) => {
  const methods = {
    'COD': 'Thanh toán khi nhận hàng',
    'Momo': 'Ví MoMo',
    'VNPAY': 'VNPay'
  }
  return methods[method] || method
}

const getDeliveryMethodName = (method) => {
  const methods = {
    'standard': 'Giao hàng tiêu chuẩn',
    'express': 'Giao hàng nhanh',
    'pickup': 'Tự đến lấy'
  }
  return methods[method] || method
}

onMounted(() => {
  if (route.query.orderData) {
    try {
      orderData.value = JSON.parse(route.query.orderData)
      console.log('Order data received:', orderData.value)
    } catch (error) {
      console.error('Error parsing order data:', error)
    }
  }
  
  if (!orderData.value) {
    orderId.value = 'ORD' + Date.now().toString().slice(-6)
    orderTotal.value = 0
    paymentMethodName.value = 'Thanh toán khi nhận hàng'
    deliveryMethodName.value = 'Giao hàng tiêu chuẩn'
  } else {
    paymentMethodName.value = getPaymentMethodName(orderData.value.payment_method || 'COD')
    deliveryMethodName.value = getDeliveryMethodName(orderData.value.delivery_method || 'standard')
  }
})
</script>

<style scoped>
.order-success {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>
