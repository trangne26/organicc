import http from '@/services/http'

const base = 'api/products'

export const listProducts = (params) => http.get(base, { params })
export const getProduct = (id) => http.get(`${base}/${id}`)
export const createProduct = (payload) => http.post(base, payload)
export const updateProduct = (id, payload) => http.put(`${base}/${id}`, payload)
export const deleteProduct = (id) => http.delete(`${base}/${id}`)

export default {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
}


