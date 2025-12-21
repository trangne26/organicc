import http from '@/services/http'

const base = 'api/chat'

export const sendChatMessage = (message) => {
  return http.post(base, { message })
}

export default {
  sendChatMessage,
}

