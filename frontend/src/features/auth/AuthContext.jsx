import { createContext, useContext, useEffect, useState } from 'react'
import { getMe, login as loginApi, register as registerApi } from '../../api/authApi.js'
import { AUTH_TOKEN_KEY } from '../../utils/constants.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => window.localStorage.getItem(AUTH_TOKEN_KEY))
  const [ready, setReady] = useState(false)

  // Validate any stored session on load; a stale or expired token quietly signs the user out.
  useEffect(() => {
    const stored = window.localStorage.getItem(AUTH_TOKEN_KEY)
    if (!stored) { setReady(true); return }
    getMe(stored)
      .then((result) => { setUser(result.user); setToken(stored) })
      .catch((error) => { if (error.status === 401) signOut() })
      .finally(() => setReady(true))
  }, [])

  function persist(result) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, result.token)
    setToken(result.token)
    setUser(result.user)
    return result
  }

  async function signIn(credentials) { return persist(await loginApi(credentials)) }
  async function signUp(details) { return persist(await registerApi(details)) }

  function signOut() {
    window.localStorage.removeItem(AUTH_TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  const value = {
    user, token, ready,
    isAuthenticated: Boolean(token),
    isAdmin: user?.role === 'admin',
    signIn, signUp, signOut,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
