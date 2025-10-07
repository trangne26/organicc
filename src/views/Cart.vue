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
                      :src="getPrimaryImage(item)"
                      :alt="item.name"
                      class="w-20 h-20 object-cover rounded-lg"
                      @error="handleImageError"
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

              <hr class="border-gray-200" />

              <div class="flex justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span class="text-orange-500">{{ formatPrice(total) }}</span>
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
import { useCart } from '@/composables/useCart'
import { useProductImage } from '@/composables/useProductImage'

const router = useRouter()
const { cartItems, updateQuantity, removeFromCart, formatPrice } = useCart()
const { handleImageError, getPrimaryImage } = useProductImage()

const promoCode = ref('')
const applyingPromo = ref(false)
const promoMessage = ref(null)
const freeShippingThreshold = 200000

const subtotal = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const shippingFee = computed(() => {
  return subtotal.value >= freeShippingThreshold ? 0 : 30000
})

const total = computed(() => {
  return subtotal.value + shippingFee.value
})

const removeItem = (itemId) => {
  removeFromCart(itemId)
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