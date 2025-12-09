import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type User = {
  _id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  role?: 'user' | 'admin'
  isActive?: boolean
  authProvider?: 'local' | 'google' | 'phone'
  profilePicture?: string
  isPhoneVerified?: boolean
  createdAt?: string
  updatedAt?: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  refreshToken: string | null
  login: (token: string, refreshToken: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('auth')
    if (stored) {
      try {
        return JSON.parse(stored).user
      } catch {
        return null
      }
    }
    return null
  })

  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem('auth')
    if (stored) {
      try {
        return JSON.parse(stored).token
      } catch {
        return null
      }
    }
    return null
  })

  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    const stored = localStorage.getItem('auth')
    if (stored) {
      try {
        return JSON.parse(stored).refreshToken
      } catch {
        return null
      }
    }
    return null
  })

  const login = (tk: string, rt: string, usr: User) => {
    setToken(tk)
    setRefreshToken(rt)
    setUser(usr)
    localStorage.setItem('auth', JSON.stringify({ token: tk, refreshToken: rt, user: usr }))
  }

  const logout = () => {
    setToken(null)
    setRefreshToken(null)
    setUser(null)
    localStorage.removeItem('auth')
  }

  const value = useMemo(() => ({ user, token, refreshToken, login, logout }), [user, token, refreshToken])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


