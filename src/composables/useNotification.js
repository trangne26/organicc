import { ref } from 'vue'

const notification = ref(null)
const timeoutId = ref(null)

export const useNotification = () => {
  const showNotification = (message, type = 'success', duration = 3000) => {
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
    }

    notification.value = {
      message,
      type,
      show: true
    }

    timeoutId.value = setTimeout(() => {
      hideNotification()
    }, duration)
  }

  const hideNotification = () => {
    if (notification.value) {
      notification.value.show = false
      setTimeout(() => {
      notification.value = null
    }, 300)
  }
  }

  const showSuccess = (message) => showNotification(message, 'success')
  const showError = (message) => showNotification(message, 'error')
  const showInfo = (message) => showNotification(message, 'info')
  const showWarning = (message) => showNotification(message, 'warning')

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
}
