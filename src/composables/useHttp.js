import { inject } from 'vue'

const HTTP_SYMBOL = Symbol('http')

export const provideHttpSymbol = (app, http) => {
  app.provide(HTTP_SYMBOL, http)
}

export const useHttp = () => {
  const client = inject(HTTP_SYMBOL)
  if (!client) throw new Error('HTTP client not provided')
  return client
}

export default useHttp


