import http from '@/services/http'

export const getCsrfCookie = () => http.get('sanctum/csrf-cookie')

export default { getCsrfCookie }


