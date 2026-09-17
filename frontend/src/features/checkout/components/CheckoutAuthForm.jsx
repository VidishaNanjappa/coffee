function CheckoutAuthForm({ checkout }) {
  const {
    authMode, authName, setAuthName, authEmail, setAuthEmail, authPassword, setAuthPassword,
    authMessage, authLoading, handleAuth, toggleAuthMode,
  } = checkout

  const authTitle = authMode === 'login' ? 'Sign in to pay' : 'Create your account'
  let authSubmitLabel = authMode === 'login' ? 'Sign in and continue' : 'Create and continue'
  if (authLoading) authSubmitLabel = 'Please wait...'
  const authSwitchLabel = authMode === 'login' ? 'Need an account? Create one' : 'Already have an account? Sign in'

  return (
    <form className="checkout-auth" onSubmit={handleAuth}>
      <strong>{authTitle}</strong>
      {authMode === 'register' && <input value={authName} onChange={(event) => setAuthName(event.target.value)} placeholder="Your name" required />}
      <input value={authEmail} onChange={(event) => setAuthEmail(event.target.value)} type="email" placeholder="Email address" required />
      <input value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} type="password" placeholder="Password (8+ characters)" minLength="8" required />
      <button type="submit" disabled={authLoading}>{authSubmitLabel}</button>
      <button type="button" className="auth-switch" onClick={toggleAuthMode}>{authSwitchLabel}</button>
      {authMessage && <span className="auth-message" aria-live="polite">{authMessage}</span>}
    </form>
  )
}

export default CheckoutAuthForm
