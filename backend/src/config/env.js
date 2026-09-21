import 'dotenv/config'

export const port = Number(process.env.PORT || 4000)
export const jwtSecret = process.env.JWT_SECRET || 'local-development-secret-change-me'

// FRONTEND_URL may be a single origin or a comma-separated list (e.g. Vercel prod + preview).
const rawOrigins = process.env.FRONTEND_URL || 'http://localhost:5173'
export const allowedOrigins = rawOrigins.split(',').map((origin) => origin.trim()).filter(Boolean)
export const frontendUrl = allowedOrigins[0]
export const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''
export const razorpayKeyId = process.env.RAZORPAY_KEY_ID || ''
export const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || ''
export const adminEmail = (process.env.ADMIN_EMAIL || 'admin@coorgcup.in').toLowerCase()
export const adminPassword = process.env.ADMIN_PASSWORD || 'change-this-password'
