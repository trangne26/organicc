import http from '@/services/http'

// For Laravel Sanctum (if enabled). Adjust path if your backend differs.
export const getCsrfCookie = () => http.get('sanctum/csrf-cookie')

export default { getCsrfCookie }


