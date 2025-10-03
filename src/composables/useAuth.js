import { ref, computed } from 'vue'
import { logout as logoutApi } from '@/api/auth'

// Reactive state
const user = ref(null)
const token = ref(null)

// Initialize from localStorage
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

// Clear auth data
const clearAuth = () => {
  user.value = null
  token.value = null
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
}

// Set auth data after login
const setAuth = (userData, tokenData) => {
  user.value = userData
  token.value = tokenData
  
  localStorage.setItem('access_token', tokenData)
  localStorage.setItem('user', JSON.stringify(userData))
}

// Logout function
const logout = async () => {
  try {
    // Call logout API if token exists
    if (token.value) {
      await logoutApi()
    }
  } catch (error) {
    console.error('Logout API error:', error)
    // Continue with local logout even if API fails
  } finally {
    clearAuth()
  }
}

// Computed properties
const isLoggedIn = computed(() => !!token.value)
const isAdmin = computed(() => user.value?.is_admin === true)
const userName = computed(() => user.value?.name || '')
const userEmail = computed(() => user.value?.email || '')

// Initialize auth on module load
initAuth()

export const useAuth = () => {
  return {
    // State
    user: computed(() => user.value),
    token: computed(() => token.value),
    
    // Computed
    isLoggedIn,
    isAdmin,
    userName,
    userEmail,
    
    // Methods
    setAuth,
    logout,
    clearAuth,
    initAuth
  }
}
