import cors from 'cors'
import express from 'express'
import { allowedOrigins } from './config/env.js'
import adminRoutes from './features/admin/admin.routes.js'
import authRoutes from './features/auth/auth.routes.js'
import cartRoutes from './features/cart/cart.routes.js'
import orderRoutes from './features/orders/orders.routes.js'
import paymentRoutes from './features/payments/payments.routes.js'
import productRoutes from './features/products/products.routes.js'
import { errorHandler } from './middleware/errorHandler.js'

export const app = express()

app.use(cors({
  origin(origin, callback) {
    // Allow same-origin/non-browser requests (no Origin header) and any configured frontend origin.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error('Not allowed by CORS'))
  },
}))
app.use(express.json())

app.get('/api/health', (request, response) => response.json({ ok: true, service: 'coorg-cup-backend' }))
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/admin', adminRoutes)

app.use(errorHandler)
