import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/'

export const http = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
  timeout: 30000,
})

http.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('access_token')
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch (_) {}
    return config
  },
  (error) => Promise.reject(normalizeError(error))
)

http.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data && typeof data === 'object') {
      // Prefer nested data shape if present
      if ('data' in data) return data.data
      return data
    }
    return response
  },
  (error) => Promise.reject(normalizeError(error))
)

function normalizeError(error) {
  if (error?.response) {
    const status = error.response.status
    const payload = error.response.data
    const message = payload?.message || payload?.error || error.message || 'Request failed'
    return { status, message, payload }
  }
  if (error?.request) {
    return { status: 0, message: 'Network error or no response from server' }
  }
  return { status: 0, message: error?.message || 'Unknown error' }
}

export default http


