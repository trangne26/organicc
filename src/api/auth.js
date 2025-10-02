import http from '@/services/http'

const base = 'api/auth'

export const login = (payload) => http.post(`${base}/login`, payload)
export const register = (payload) => http.post(`${base}/register`, payload)
export const logout = () => http.post(`${base}/logout`)
export const me = () => http.get(`${base}/me`)
export const updateProfile = (payload) => http.put(`${base}/profile`, payload)
export const changePassword = (payload) => http.put(`${base}/change-password`, payload)

export default {
  login,
  register,
  logout,
  me,
  updateProfile,
  changePassword,
}


