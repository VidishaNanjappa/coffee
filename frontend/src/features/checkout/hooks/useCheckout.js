import { useState } from 'react'
import { addCartItem, clearCart } from '../../../api/cartApi.js'
import { startCheckout } from '../../../api/paymentsApi.js'
import { useAuth } from '../../auth/AuthContext.jsx'

export function useCheckout(cart) {
  const { token, isAuthenticated, signIn, signUp, signOut } = useAuth()
  const [authMode, setAuthMode] = useState('login')
  const [authName, setAuthName] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authMessage, setAuthMessage] = useState('')
  const [checkoutMessage, setCheckoutMessage] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  async function completeCheckout(activeToken) {
    await clearCart(activeToken)
    await Promise.all(cart.map((item) => addCartItem(activeToken, { productId: item.id, quantity: item.quantity })))
    const result = await startCheckout(activeToken)
    if (result.checkoutUrl) window.location.assign(result.checkoutUrl)
    else {
      setCheckoutMessage(result.message || 'Checkout is ready.')
      setAuthMessage('Signed in successfully.')
    }
  }

  async function handleCheckout() {
    setCheckoutMessage('')
    if (!token) {
      setCheckoutMessage('Sign in or create an account to continue.')
      return
    }
    try {
      await completeCheckout(token)
    } catch (error) {
      if (error.status === 401) {
        signOut()
        setCheckoutMessage('Your session expired. Please sign in again to continue.')
      } else setCheckoutMessage(error.message)
    }
  }

  async function handleAuth(event) {
    event.preventDefault()
    setAuthLoading(true)
    setAuthMessage('')
    try {
      const result = await (authMode === 'login'
        ? signIn({ email: authEmail, password: authPassword })
        : signUp({ name: authName, email: authEmail, password: authPassword }))
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
    isAuthenticated, authMode, authName, setAuthName, authEmail, setAuthEmail, authPassword, setAuthPassword,
    authMessage, checkoutMessage, authLoading, handleCheckout, handleAuth, toggleAuthMode,
  }
}
