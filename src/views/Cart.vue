<template>
  <div class="cart">
    <section class="page-header bg-green-50 py-12">
      <div class="container mx-auto px-4">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-800 mb-4">Giỏ hàng</h1>
          <p class="text-gray-600">
            Xem lại các sản phẩm bạn đã chọn
          </p>
        </div>
      </div>
    </section>

    <div class="container mx-auto px-4 py-8">
      <div v-if="cartItems.length === 0" class="text-center py-16">
        <div class="text-6xl text-gray-400 mb-6">🛒</div>
        <h2 class="text-2xl font-bold text-gray-600 mb-4">Giỏ hàng trống</h2>
        <p class="text-gray-500 mb-8">Hãy thêm một số sản phẩm vào giỏ hàng của bạn</p>
        <router-link
            to="/products"
            class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Tiếp tục mua sắm
        </router-link>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-800">
                Sản phẩm trong giỏ hàng ({{ cartItems.length }})
              </h2>
            </div>

            <div class="divide-y divide-gray-200">
              <div
                  v-for="item in cartItems"
                  :key="item.id"
                  class="p-6 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <router-link :to="`/product/${item.id}`" class="flex-shrink-0">
                  <img
                      :src="item.image"
                      :alt="item.name"
                      class="w-20 h-20 object-cover rounded-lg"
                  />
                </router-link>

                <div class="flex-1 min-w-0">
                  <router-link
                      :to="`/product/${item.id}`"
                      class="text-lg font-semibold text-gray-800 hover:text-green-600 transition-colors"
                  >
                    {{ item.name }}
                  </router-link>
                  <p class="text-sm text-gray-600 mt-1">{{ item.description }}</p>
                  <div class="flex items-center space-x-4 mt-2">
                    <span class="text-lg font-bold text-orange-500">
                      {{ formatPrice(item.price) }}
                    </span>
                    <span v-if="item.unit" class="text-sm text-gray-500">/ {{ item.unit }}</span>
                  </div>
                </div>

                <div class="flex items-center space-x-3">
                  <div class="flex items-center border border-gray-300 rounded-lg">
                    <button
                        @click="updateQuantity(item.id, item.quantity - 1)"
                        :disabled="item.quantity <= 1"
                        class="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <input
                        :value="item.quantity"
                        @change="updateQuantity(item.id, parseInt($event.target.value))"
                        type="number"
                        min="1"
                        class="w-16 text-center py-2 border-0 focus:ring-0"
                    />
                    <button
                        @click="updateQuantity(item.id, item.quantity + 1)"
                        class="px-3 py-2 text-gray-600 hover:text-gray-800"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div class="flex items-center space-x-4">
                  <span class="text-lg font-bold text-gray-800">
                    {{ formatPrice(item.price * item.quantity) }}
                  </span>
                  <button
                      @click="removeItem(item.id)"
                      class="text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Xóa sản phẩm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <router-link
                to="/products"
                class="text-green-600 hover:text-green-700 font-semibold transition-colors flex items-center space-x-2"
            >
              <span>←</span>
              <span>Tiếp tục mua sắm</span>
            </router-link>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md sticky top-4">
            <div class="p-6 border-b border-gray-200">
              <h3 class="text-xl font-semibold text-gray-800">Tóm tắt đơn hàng</h3>
            </div>

            <div class="p-6 space-y-4">
              <div class="flex justify-between">
                <span class="text-gray-600">Tạm tính:</span>
                <span class="font-semibold">{{ formatPrice(subtotal) }}</span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-600">Phí vận chuyển:</span>
                <span class="font-semibold">
                  {{ shippingFee > 0 ? formatPrice(shippingFee) : 'Miễn phí' }}
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

              <div class="mt-6">
                <div class="flex space-x-2">
                  <input
                      v-model="promoCode"
                      type="text"
                      placeholder="Mã giảm giá"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                      @click="applyPromoCode"
                      :disabled="!promoCode.trim() || applyingPromo"
                      class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ applyingPromo ? 'Đang áp dụng...' : 'Áp dụng' }}
                  </button>
                </div>
                <p v-if="promoMessage" :class="[
                  'text-sm mt-2',
                  promoMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ promoMessage.text }}
                </p>
              </div>

              <button
                  @click="goToCheckout"
                  class="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors mt-6"
              >
                Tiến hành thanh toán
              </button>

              <div v-if="freeShippingThreshold - subtotal > 0" class="bg-blue-50 p-4 rounded-lg mt-4">
                <p class="text-sm text-blue-600">
                  💡 Mua thêm {{ formatPrice(freeShippingThreshold - subtotal) }} để được miễn phí vận chuyển!
                </p>
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

const promoCode = ref('')
const applyingPromo = ref(false)
const promoMessage = ref(null)
const freeShippingThreshold = 200000

const cartItems = ref([
  {
    id: 1,
    name: 'Rau cải xanh hữu cơ',
    description: 'Rau cải xanh tươi ngon, không thuốc trừ sâu',
    price: 25000,
    quantity: 2,
    image: '/images/products/cai-xanh.jpg',
    unit: 'bó'
  },
  {
    id: 2,
    name: 'Táo Fuji hữu cơ',
    description: 'Táo Fuji ngọt ngào, giòn tan',
    price: 45000,
    quantity: 1,
    image: '/images/products/tao-fuji.jpg',
    unit: 'kg'
  },
  {
    id: 3,
    name: 'Mật ong rừng nguyên chất',
    description: 'Mật ong rừng 100% nguyên chất',
    price: 120000,
    quantity: 1,
    image: '/images/products/mat-ong.jpg',
    unit: 'hũ'
  }
])

const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const shippingFee = computed(() => {
  return subtotal.value >= freeShippingThreshold ? 0 : 30000
})

const discount = ref(0)

const total = computed(() => {
  return subtotal.value + shippingFee.value - discount.value
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
}

const updateQuantity = (itemId, newQuantity) => {
  if (newQuantity < 1) return

  const item = cartItems.value.find(item => item.id === itemId)
  if (item) {
    item.quantity = newQuantity
  }
}

const removeItem = (itemId) => {
  const index = cartItems.value.findIndex(item => item.id === itemId)
  if (index > -1) {
    cartItems.value.splice(index, 1)
  }
}

const applyPromoCode = async () => {
  if (!promoCode.value.trim()) return

  applyingPromo.value = true
  promoMessage.value = null

  setTimeout(() => {
    const promoCodes = {
      'WELCOME10': { type: 'percentage', value: 10 },
      'SAVE20K': { type: 'fixed', value: 20000 },
      'FREESHIP': { type: 'freeship', value: 0 }
    }

    const promo = promoCodes[promoCode.value.toUpperCase()]

    if (promo) {
      if (promo.type === 'percentage') {
        discount.value = Math.floor(subtotal.value * promo.value / 100)
        promoMessage.value = {
          type: 'success',
          text: `Đã áp dụng mã giảm giá ${promo.value}%`
        }
      } else if (promo.type === 'fixed') {
        discount.value = promo.value
        promoMessage.value = {
          type: 'success',
          text: `Đã áp dụng mã giảm ${formatPrice(promo.value)}`
        }
      } else if (promo.type === 'freeship') {
        promoMessage.value = {
          type: 'success',
          text: 'Đã áp dụng mã miễn phí vận chuyển'
        }
      }
    } else {
      promoMessage.value = {
        type: 'error',
        text: 'Mã giảm giá không hợp lệ'
      }
    }

    applyingPromo.value = false
  }, 1000)
}

const goToCheckout = () => {
  router.push('/checkout')
}
</script>

<style scoped>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>