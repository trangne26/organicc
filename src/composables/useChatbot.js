import { ref } from 'vue'
import { sendChatMessage } from '@/api/chatbot'

export const useChatbot = () => {
  const loading = ref(false)
  const error = ref(null)

  const sendMessage = async (message) => {
    if (!message || !message.trim()) {
      error.value = 'Xin lỗi, bạn vui lòng nhập câu hỏi.'
      throw new Error(error.value)
    }

    loading.value = true
    error.value = null

    try {
      const response = await sendChatMessage(message.trim())
      
      if (!response.success) {
        const errorMessage = response.reply || 'Có lỗi xảy ra. Vui lòng thử lại.'
        error.value = errorMessage
        return response
      }

      return response
    } catch (err) {
      if (err.payload) {
        error.value = err.payload.reply || err.payload.message || err.message || 'Có lỗi xảy ra. Vui lòng thử lại.'
      } else if (err.status === 0) {
        error.value = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet.'
      } else {
        error.value = err.message || 'Có lỗi xảy ra. Vui lòng thử lại.'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  return { sendMessage, loading, error }
}

