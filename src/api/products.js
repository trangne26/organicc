import http from '@/services/http'

const base = 'api/products'

export const listProducts = (params) => http.get(base, { params })
export const getProduct = (id) => http.get(`${base}/${id}`)
export const createProduct = (payload, config = {}) => {
  // If payload is FormData, set proper headers
  if (payload instanceof FormData) {
    return http.post(base, payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...config
    })
  }
  return http.post(base, payload, config)
}

export const updateProduct = (id, payload, config = {}) => {
  // If payload is FormData, set proper headers
  if (payload instanceof FormData) {
    return http.post(`${base}/${id}/update`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      ...config
    })
  }
  return http.put(`${base}/${id}`, payload, config)
}
export const deleteProduct = (id) => http.delete(`${base}/${id}`)

export default {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
}


