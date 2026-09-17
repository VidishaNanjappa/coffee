import 'dotenv/config'

export const port = Number(process.env.PORT || 4000)
export const jwtSecret = process.env.JWT_SECRET || 'local-development-secret-change-me'
export const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
export const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''
export const adminEmail = (process.env.ADMIN_EMAIL || 'admin@coorgcup.in').toLowerCase()
export const adminPassword = process.env.ADMIN_PASSWORD || 'change-this-password'
