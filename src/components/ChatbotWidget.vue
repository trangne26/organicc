<template>
  <div class="fixed bottom-4 right-4 z-50">
    <transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 scale-95"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="bg-white rounded-lg shadow-2xl w-96 h-[600px] flex flex-col border border-gray-200"
        >
        <div class="bg-green-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span class="text-green-600 text-lg">💬</span>
            </div>
            <div>
              <h3 class="font-semibold text-sm">Chat hỗ trợ</h3>
              <p class="text-xs text-green-100">Chúng tôi luôn sẵn sàng giúp bạn</p>
            </div>
          </div>
          <button
            @click="toggleChat"
            class="text-white hover:text-gray-200 transition-colors"
            aria-label="Đóng chat"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" ref="messagesContainer">
          <div v-if="messages.length === 0" class="text-center text-gray-500 py-8">
            <div class="text-4xl mb-2">👋</div>
            <p class="text-sm">Xin chào! Tôi có thể giúp gì cho bạn?</p>
            <p class="text-xs mt-2 text-gray-400">Hỏi về sản phẩm, giao hàng, thanh toán...</p>
          </div>

          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="[
              'flex',
              msg.type === 'user' ? 'justify-end' : 'justify-start'
            ]"
          >
            <div
              :class="[
                'max-w-[80%] rounded-lg px-4 py-2',
                msg.type === 'user'
                  ? 'bg-green-600 text-white'
                  : msg.isError
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-white text-gray-800 shadow-sm border border-gray-200'
              ]"
            >
              <p class="text-sm whitespace-pre-wrap">{{ msg.content }}</p>
              
              <div v-if="msg.data?.faq" class="mt-3 pt-3 border-t border-gray-200">
                <div class="text-xs font-semibold text-gray-600 mb-1">Câu hỏi:</div>
                <div class="text-xs text-gray-700">{{ msg.data.faq.question }}</div>
              </div>

              <div v-if="msg.data?.products && msg.data.products.length > 0" class="mt-3 space-y-2">
                <div class="text-xs font-semibold text-gray-600 mb-2">Sản phẩm gợi ý:</div>
                <div
                  v-for="product in msg.data.products.slice(0, 3)"
                  :key="product.id"
                  class="bg-gray-50 rounded p-2 border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                  @click="goToProduct(product.slug)"
                >
                  <div class="flex gap-2">
                    <img
                      v-if="product.primary_image"
                      :src="product.primary_image"
                      :alt="product.name"
                      class="w-12 h-12 object-cover rounded"
                    />
                    <div class="flex-1 min-w-0">
                      <div class="text-xs font-medium text-gray-900 truncate">{{ product.name }}</div>
                      <div class="text-xs text-green-600 font-semibold mt-1">
                        {{ formatPrice(product.price) }} đ
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  v-if="msg.data.products.length > 3"
                  @click="viewAllProducts(msg.data.products)"
                  class="text-xs text-green-600 hover:text-green-700 mt-1"
                >
                  Xem thêm {{ msg.data.products.length - 3 }} sản phẩm...
                </button>
              </div>
            </div>
          </div>

          <div v-if="loading" class="flex justify-start">
            <div class="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <div class="flex gap-1">
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0s"></span>
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t border-gray-200 p-4 bg-white rounded-b-lg">
          <form @submit.prevent="handleSend" class="flex gap-2">
            <input
              v-model="inputMessage"
              type="text"
              placeholder="Nhập câu hỏi của bạn..."
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              :disabled="loading"
              maxlength="1000"
            />
            <button
              type="submit"
              :disabled="loading || !inputMessage.trim()"
              class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              aria-label="Gửi tin nhắn"
            >
              <svg
                v-if="!loading"
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              <span v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block"></span>
            </button>
          </form>
          <p class="text-xs text-gray-400 mt-2 text-center">
            {{ inputMessage.length }}/1000 ký tự
          </p>
        </div>
      </div>
    </transition>

    <button
      v-if="!isOpen"
      @click="toggleChat"
      class="bg-green-600 text-white rounded-full w-14 h-14 shadow-lg hover:bg-green-700 transition-all hover:scale-110 flex items-center justify-center"
      aria-label="Mở chat"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      <span
        v-if="messages.length > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
      >
        {{ messages.length }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useChatbot } from '@/composables/useChatbot'

const router = useRouter()
const { sendMessage, loading, error } = useChatbot()

const isOpen = ref(false)
const inputMessage = ref('')
const messages = ref([])
const messagesContainer = ref(null)

const STORAGE_KEY = 'chatbot_messages'

const loadMessages = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsedMessages = JSON.parse(saved)
      if (Array.isArray(parsedMessages)) {
        messages.value = parsedMessages
      }
    }
  } catch (err) {
    console.error('Failed to load chat history:', err)
    localStorage.removeItem(STORAGE_KEY)
  }
}

const saveMessages = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.value))
  } catch (err) {
    console.error('Failed to save chat history:', err)
    if (err.name === 'QuotaExceededError') {
      const recentMessages = messages.value.slice(-20)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recentMessages))
        messages.value = recentMessages
      } catch (e) {
        console.error('Failed to save even after cleanup:', e)
      }
    }
  }
}

onMounted(() => {
  loadMessages()
})

const toggleChat = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(parseFloat(price))
}

const goToProduct = (slug) => {
  router.push(`/products/${slug}`)
  toggleChat()
}

const viewAllProducts = (products) => {
  router.push('/products')
  toggleChat()
}

const handleSend = async () => {
  const message = inputMessage.value.trim()
  if (!message || loading.value) return

  messages.value.push({
    type: 'user',
    content: message,
  })

  const userMessage = message
  inputMessage.value = ''

  await nextTick()
  scrollToBottom()

  try {
    const response = await sendMessage(userMessage)

    messages.value.push({
      type: 'bot',
      content: response.reply,
      isError: !response.success || response.type === 'error',
      data:
        response.type === 'faq'
          ? { faq: response.faq }
          : response.type === 'product_search'
          ? { products: response.products }
          : null,
    })
  } catch (err) {
    messages.value.push({
      type: 'bot',
      content: error.value || 'Có lỗi xảy ra. Vui lòng thử lại.',
      isError: true,
    })
  } finally {
    await nextTick()
    scrollToBottom()
  }
}

watch(
  () => messages.value.length,
  () => {
    nextTick(() => {
      scrollToBottom()
    })
  }
)

watch(
  messages,
  () => {
    saveMessages()
  },
  { deep: true }
)
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

