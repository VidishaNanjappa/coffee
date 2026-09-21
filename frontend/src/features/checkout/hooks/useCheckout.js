import { useEffect, useState } from 'react'
import { getMe, login, register } from '../../../api/authApi.js'
import { addCartItem, clearCart } from '../../../api/cartApi.js'
import { startCheckout } from '../../../api/paymentsApi.js'
import { AUTH_TOKEN_KEY } from '../../../utils/constants.js'

export function useCheckout(cart) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(window.localStorage.getItem(AUTH_TOKEN_KEY)))
  const [authMode, setAuthMode] = useState('login')
  const [authName, setAuthName] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [checkoutMessage, setCheckoutMessage] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  function signOut(message = '') {
    window.localStorage.removeItem(AUTH_TOKEN_KEY)
    setUser(null)
    setIsAuthenticated(false)
    setAuthMessage('')
    setCheckoutMessage(message)
  }

  // Validate any stored session on load; a stale or expired token quietly signs the user out.
  useEffect(() => {
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) return
    getMe(token)
      .then((result) => { setUser(result.user); setIsAuthenticated(true) })
      .catch((error) => { if (error.status === 401) signOut() })
  }, [])

  async function completeCheckout(token) {
    await clearCart(token)
    await Promise.all(cart.map((item) => addCartItem(token, { productId: item.id, quantity: item.quantity })))
    const result = await startCheckout(token)
    if (result.checkoutUrl) window.location.assign(result.checkoutUrl)
    else {
      setCheckoutMessage(result.message || 'Checkout is ready.')
      setAuthMessage('Signed in successfully.')
    }
  }

  async function handleCheckout() {
    setCheckoutMessage('')
    const token = window.localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) {
      setCheckoutMessage('Sign in or create an account to continue.')
      return
    }
    try {
      await completeCheckout(token)
    } catch (error) {
      if (error.status === 401) signOut('Your session expired. Please sign in again to continue.')
      else setCheckoutMessage(error.message)
    }
  }

  async function handleAuth(event) {
    event.preventDefault()
    setAuthLoading(true)
    setAuthMessage('')
    try {
      const result = await (authMode === 'login'
        ? login({ email: authEmail, password: authPassword })
        : register({ name: authName, email: authEmail, password: authPassword }))
      window.localStorage.setItem(AUTH_TOKEN_KEY, result.token)
      setUser(result.user)
      setIsAuthenticated(true)
      setAuthMessage('Signed in. Starting checkout...')
      await completeCheckout(result.token)
    } catch (error) {
      setAuthMessage(error.message)
      setCheckoutMessage(error.message)
    } finally {
      setAuthLoading(false)
    }
  }

  function toggleAuthMode() {
    setAuthMode((mode) => mode === 'login' ? 'register' : 'login')
    setAuthMessage('')
    setCheckoutMessage('')
  }

  return {
    user, isAuthenticated, signOut, authMode, authName, setAuthName, authEmail, setAuthEmail, authPassword, setAuthPassword,
    authMessage, checkoutMessage, authLoading, handleCheckout, handleAuth, toggleAuthMode,
  }
}
