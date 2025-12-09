import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../../api/client'
import { useAuth } from '../../auth/useAuth'
import { GoogleLogin } from '@react-oauth/google'

export default function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasRedirected = useRef(false)

  useEffect(() => {
    if (user && !hasRedirected.current) {
      hasRedirected.current = true
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    }
  }, [user, navigate, location])

  return (
    <div className="container-default py-10 max-w-md">
      <h2 className="text-2xl font-semibold mb-6">Login</h2>
      <p className="text-gray-600 mb-6">Please sign in with your Google account to continue.</p>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            try {
              setLoading(true)
              const res = await api.post('/auth/google-signin', {
                idToken: credentialResponse.credential
              })

              console.log('Login response:', res.data)

              const token = res.data.accessToken
              const refreshToken = res.data.refreshToken
              const userData = res.data.user

              login(token, refreshToken, userData)
              const from = location.state?.from?.pathname || '/dashboard'
              navigate(from, { replace: true })
            } catch (err: any) {
              console.error('Login error:', err)
              setError(err?.response?.data?.message || 'Google login failed')
            } finally {
              setLoading(false)
            }
          }}
          onError={() => {
            setError('Google login failed')
          }}
        />
      </div>
    </div>
  )
}
