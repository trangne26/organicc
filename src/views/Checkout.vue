<template>
  <div class="checkout">
    <section class="page-header bg-green-50 py-12">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-800 mb-4">Thanh toán</h1>
          <p class="text-gray-600">
            Hoàn tất đơn hàng của bạn
          </p>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <div class="flex items-center justify-center space-x-4 sm:space-x-8">
          <div
            v-for="(step, index) in checkoutSteps"
            :key="step.id"
            class="flex items-center"
          >
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold',
                currentStep >= index + 1
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              ]"
            >
              {{ index + 1 }}
            </div>
            <span
              :class="[
                'ml-2 text-sm font-medium',
                currentStep >= index + 1 ? 'text-green-600' : 'text-gray-500'
              ]"
            >
              {{ step.name }}
            </span>
            <div
              v-if="index < checkoutSteps.length - 1"
              :class="[
                'w-8 sm:w-16 h-0.5 ml-4',
                currentStep > index + 1 ? 'bg-green-600' : 'bg-gray-300'
              ]"
            ></div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <form @submit.prevent="processOrder" class="space-y-8">
            <div v-if="currentStep === 1" class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-semibold text-gray-800 mb-6">Thông tin giao hàng</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    v-model="shippingInfo.fullName"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    v-model="shippingInfo.phone"
                    type="tel"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    v-model="shippingInfo.email"
                    type="email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nhập email (tùy chọn)"
                  />
                </div>
                
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ *
                  </label>
                  <input
                    v-model="shippingInfo.address"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Số nhà, tên đường"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Phường/Xã *
                  </label>
                  <select
                    v-model="shippingInfo.ward"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Chọn phường/xã</option>
                    <option value="ward1">Phường 1</option>
                    <option value="ward2">Phường 2</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Quận/Huyện *
                  </label>
                  <select
                    v-model="shippingInfo.district"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Chọn quận/huyện</option>
                    <option value="district1">Quận 1</option>
                    <option value="district3">Quận 3</option>
                  </select>
                </div>
                
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    v-model="shippingInfo.notes"
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)"
                  ></textarea>
                </div>
              </div>
              
              <div class="flex justify-end mt-6">
                <button
                  type="button"
                  @click="nextStep"
                  class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Tiếp tục
                </button>
              </div>
            </div>

            <div v-if="currentStep === 2" class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-semibold text-gray-800 mb-6">Phương thức giao hàng</h2>
              
              <div class="space-y-4">
                <div
                  v-for="method in deliveryMethods"
                  :key="method.id"
                  :class="[
                    'border rounded-lg p-4 cursor-pointer transition-colors',
                    deliveryMethod === method.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  ]"
                  @click="deliveryMethod = method.id"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <input
                        :id="method.id"
                        v-model="deliveryMethod"
                        :value="method.id"
                        type="radio"
                        class="text-green-600 focus:ring-green-500"
                      />
                      <label :for="method.id" class="cursor-pointer">
                        <div class="font-semibold text-gray-800">{{ method.name }}</div>
                        <div class="text-sm text-gray-600">{{ method.description }}</div>
                        <div class="text-xs text-gray-500 mt-1">{{ method.time }}</div>
                      </label>
                    </div>
                    <div class="text-lg font-bold text-orange-500">
                      {{ method.fee > 0 ? formatPrice(method.fee) : 'Miễn phí' }}
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex justify-between mt-6">
                <button
                  type="button"
                  @click="prevStep"
                  class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  @click="nextStep"
                  class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Tiếp tục
                </button>
              </div>
            </div>

            <div v-if="currentStep === 3" class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-semibold text-gray-800 mb-6">Phương thức thanh toán</h2>
              
              <div class="space-y-4">
                <div
                  v-for="method in paymentMethods"
                  :key="method.id"
                  :class="[
                    'border rounded-lg p-4 cursor-pointer transition-colors',
                    paymentMethod === method.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  ]"
                  @click="paymentMethod = method.id"
                >
                  <div class="flex items-center space-x-3">
                    <input
                      :id="method.id"
                      v-model="paymentMethod"
                      :value="method.id"
                      type="radio"
                      class="text-green-600 focus:ring-green-500"
                    />
                    <label :for="method.id" class="cursor-pointer flex-1">
                      <div class="flex items-center space-x-3">
                        <span class="text-2xl">{{ method.icon }}</span>
                        <div>
                          <div class="font-semibold text-gray-800">{{ method.name }}</div>
                          <div class="text-sm text-gray-600">{{ method.description }}</div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div class="flex justify-between mt-6">
                <button
                  type="button"
                  @click="prevStep"
                  class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  :disabled="processing"
                  class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ processing ? 'Đang xử lý...' : 'Đặt hàng' }}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md sticky top-4">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-xl font-semibold text-gray-800">Đơn hàng của bạn</h3>
            </div>
            
            <div class="p-6">
              <div class="space-y-4 mb-6">
                <div
                  v-for="item in orderItems"
                  :key="item.id"
                  class="flex items-center space-x-3"
                >
                  <img
                    :src="item.image"
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

              <div class="space-y-3 border-t border-gray-200 pt-4">
                <div class="flex justify-between">
                  <span class="text-gray-600">Tạm tính:</span>
                  <span class="font-semibold">{{ formatPrice(subtotal) }}</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-gray-600">Phí vận chuyển:</span>
                  <span class="font-semibold">
                    {{ selectedDeliveryFee > 0 ? formatPrice(selectedDeliveryFee) : 'Miễn phí' }}
                  </span>
                </div>
                
                <div v-if="discount > 0" class="flex justify-between text-green-600">
                  <span>Giảm giá:</span>
                  <span class="font-semibold">-{{ formatPrice(discount) }}</span>
                </div>
                
                <hr class="border-gray-200" />
                
                <div class="flex justify-between text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span class="text-orange-500">{{ formatPrice(total) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentStep = ref(1)
const processing = ref(false)

const checkoutSteps = [
  { id: 1, name: 'Thông tin' },
  { id: 2, name: 'Giao hàng' },
  { id: 3, name: 'Thanh toán' }
]

const shippingInfo = ref({
  fullName: '',
  phone: '',
  email: '',
  address: '',
  ward: '',
  district: '',
  notes: ''
})

const deliveryMethod = ref('standard')
const paymentMethod = ref('cod')

const deliveryMethods = [
  {
    id: 'standard',
    name: 'Giao hàng tiêu chuẩn',
    description: 'Giao hàng trong 2-3 ngày làm việc',
    time: '2-3 ngày',
    fee: 30000
  },
  {
    id: 'express',
    name: 'Giao hàng nhanh',
    description: 'Giao hàng trong ngày (khu vực nội thành)',
    time: 'Trong ngày',
    fee: 50000
  },
  {
    id: 'pickup',
    name: 'Tự đến lấy',
    description: 'Lấy hàng tại cửa hàng',
    time: 'Ngay',
    fee: 0
  }
]

const paymentMethods = [
  {
    id: 'cod',
    name: 'Thanh toán khi nhận hàng',
    description: 'Thanh toán bằng tiền mặt khi nhận hàng',
    icon: '💵'
  },
  {
    id: 'bank_transfer',
    name: 'Chuyển khoản ngân hàng',
    description: 'Chuyển khoản qua số tài khoản',
    icon: '🏦'
  },
  {
    id: 'momo',
    name: 'Ví MoMo',
    description: 'Thanh toán qua ví điện tử MoMo',
    icon: '📱'
  },
  {
    id: 'zalopay',
    name: 'ZaloPay',
    description: 'Thanh toán qua ví ZaloPay',
    icon: '💳'
  }
]

const orderItems = ref([
  {
    id: 1,
    name: 'Rau cải xanh hữu cơ',
    price: 25000,
    quantity: 2,
    image: '/images/products/cai-xanh.jpg'
  },
  {
    id: 2,
    name: 'Táo Fuji hữu cơ',
    price: 45000,
    quantity: 1,
    image: '/images/products/tao-fuji.jpg'
  },
  {
    id: 3,
    name: 'Mật ong rừng nguyên chất',
    price: 120000,
    quantity: 1,
    image: '/images/products/mat-ong.jpg'
  }
])

const discount = ref(0)

const subtotal = computed(() => {
  return orderItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const selectedDeliveryFee = computed(() => {
  const method = deliveryMethods.find(m => m.id === deliveryMethod.value)
  return method ? method.fee : 0
})

const total = computed(() => {
  return subtotal.value + selectedDeliveryFee.value - discount.value
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const processOrder = async () => {
  processing.value = true

  setTimeout(() => {
    const order = {
      id: Date.now(),
      items: orderItems.value,
      shipping: shippingInfo.value,
      delivery: deliveryMethod.value,
      payment: paymentMethod.value,
      subtotal: subtotal.value,
      deliveryFee: selectedDeliveryFee.value,
      discount: discount.value,
      total: total.value,
      status: 'pending',
      createdAt: new Date()
    }
    console.log('orderorder', order)

    router.push('/order-success')
    
    processing.value = false
  }, 2000)
}
</script>

<style scoped>
input[type="radio"]:checked {
  background-color: #059669;
  border-color: #059669;
}
</style>
