import http from '@/services/http'

const base = 'api/categories'

export const listCategories = (params) => http.get(base, { params })
export const getCategory = (id) => http.get(`${base}/${id}`)
export const createCategory = (payload) => http.post(base, payload)
export const updateCategory = (id, payload) => http.put(`${base}/${id}`, payload)
export const deleteCategory = (id) => http.delete(`${base}/${id}`)

export default {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
}


