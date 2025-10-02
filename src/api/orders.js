import http from '@/services/http'

const base = 'api/orders'

export const listOrders = (params) => http.get(base, { params })
export const getOrder = (id) => http.get(`${base}/${id}`)
export const createOrder = (payload) => http.post(base, payload)
export const updateOrder = (id, payload) => http.put(`${base}/${id}`, payload)
export const deleteOrder = (id) => http.delete(`${base}/${id}`)
export const updateOrderStatus = (id, payload) => http.put(`${base}/${id}/status`, payload)

export default {
  listOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
}


