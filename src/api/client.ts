import axios from 'axios'
import { env } from '../config/env'

const api = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: false,
})

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('auth')
  if (stored) {
    try {
      const { token } = JSON.parse(stored)
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch { }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const stored = localStorage.getItem('auth')
        if (stored) {
          const { refreshToken } = JSON.parse(stored)

          if (refreshToken) {
            // Call refresh endpoint
            const { data } = await axios.post(`${env.apiBaseUrl}/auth/refresh-token`, {
              refreshToken
            })

            // Update local storage with new tokens
            const authData = JSON.parse(stored)
            authData.token = data.accessToken
            authData.refreshToken = data.refreshToken
            localStorage.setItem('auth', JSON.stringify(authData))

            // Update Authorization header and retry original request
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
            return api(originalRequest)
          }
        }
      } catch (refreshError) {
        // If refresh fails, logout user
        localStorage.removeItem('auth')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api


