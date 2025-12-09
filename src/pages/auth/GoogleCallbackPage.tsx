import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'

export default function GoogleCallbackPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    const userParam = params.get('user')
    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam))
        // TODO: Backend should potentially return refresh token in redirect params
        login(token, '', user)
        navigate('/profile', { replace: true })
        return
      } catch { }
    }
    navigate('/login', { replace: true })
  }, [location.search, login, navigate])

  return (
    <div className="container-default py-10">
      <p>Signing you in with Google...</p>
    </div>
  )
}


