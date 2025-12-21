import { ref, computed } from 'vue'
import { logout as logoutApi } from '@/api/auth'

const user = ref(null)
const token = ref(null)

const initAuth = () => {
  try {
    const storedToken = localStorage.getItem('access_token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken) {
      token.value = storedToken
    }
    
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
  } catch (error) {
    console.error('Error initializing auth:', error)
    clearAuth()
  }
}

const clearAuth = () => {
  user.value = null
  token.value = null
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
}

const setAuth = (userData, tokenData) => {
  user.value = userData
  token.value = tokenData
  
  localStorage.setItem('access_token', tokenData)
  localStorage.setItem('user', JSON.stringify(userData))
}

const logout = async () => {
  try {
    if (token.value) {
      await logoutApi()
    }
  } catch (error) {
    console.error('Logout API error:', error)
  } finally {
    clearAuth()
  }
}

const isLoggedIn = computed(() => !!token.value)
const isAdmin = computed(() => user.value?.is_admin === true)
const userName = computed(() => user.value?.name || '')
const userEmail = computed(() => user.value?.email || '')

initAuth()

export const useAuth = () => {
  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    
    isLoggedIn,
    isAdmin,
    userName,
    userEmail,
    
    setAuth,
    logout,
    clearAuth,
    initAuth
  }
}
