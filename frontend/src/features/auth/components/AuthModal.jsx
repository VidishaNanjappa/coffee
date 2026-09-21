import { X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../AuthContext.jsx'

function AuthModal({ onClose }) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const isLogin = mode === 'login'

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      if (isLogin) await signIn({ email, password })
      else await signUp({ name, email, password })
      onClose()
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  let submitLabel = isLogin ? 'Sign in' : 'Create account'
  if (loading) submitLabel = 'Please wait...'

  return (
    <div className="auth-modal-backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <button className="icon-button auth-modal-close" onClick={onClose} aria-label="Close"><X size={20} /></button>
        <span className="kicker">{isLogin ? 'Welcome back' : 'Join Coorg Cup'}</span>
        <h2>{isLogin ? 'Sign in to your account' : 'Create your account'}</h2>
        <form className="auth-modal-form" onSubmit={handleSubmit}>
          {!isLogin && <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required />}
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email address" required />
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password (8+ characters)" minLength="8" required />
          <button type="submit" disabled={loading}>{submitLabel}</button>
          {message && <span className="auth-message" aria-live="polite">{message}</span>}
        </form>
        <button type="button" className="auth-switch" onClick={() => { setMode(isLogin ? 'register' : 'login'); setMessage('') }}>
          {isLogin ? 'Need an account? Create one' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}

export default AuthModal
