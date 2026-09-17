import 'dotenv/config'
import bcrypt from 'bcryptjs'
import cors from 'cors'
import express from 'express'
import jwt from 'jsonwebtoken'
import Stripe from 'stripe'
import { createId, loadDatabase, saveDatabase } from './store.js'

const app = express()
const port = Number(process.env.PORT || 4000)
const jwtSecret = process.env.JWT_SECRET || 'local-development-secret-change-me'
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null

app.use(cors({ origin: frontendUrl }))
app.use(express.json())

function publicUser(user) {
  const { passwordHash, ...safeUser } = user
  return safeUser
}

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, email: user.email }, jwtSecret, { expiresIn: '7d' })
}

function authRequired(request, response, next) {
  const token = request.headers.authorization?.replace('Bearer ', '')
  if (!token) return response.status(401).json({ error: 'Authentication required' })
  try {
    request.auth = jwt.verify(token, jwtSecret)
    next()
  } catch {
    return response.status(401).json({ error: 'Invalid or expired token' })
  }
}

function adminRequired(request, response, next) {
  if (request.auth?.role !== 'admin') return response.status(403).json({ error: 'Admin access required' })
  next()
}

function requiredText(value, field) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${field} is required`)
  return value.trim()
}

function getCart(database, userId) {
  let cart = database.carts.find((item) => item.userId === userId)
  if (!cart) {
    cart = { userId, items: [] }
    database.carts.push(cart)
  }
  return cart
}

function hydrateCart(database, cart) {
  const items = cart.items.map((item) => {
    const product = database.products.find((candidate) => candidate.id === item.productId)
    return product ? { ...item, product, lineTotal: product.price * item.quantity } : null
  }).filter(Boolean)
  return { ...cart, items, subtotal: items.reduce((total, item) => total + item.lineTotal, 0) }
}

async function bootstrapAdmin() {
  const database = await loadDatabase()
  const email = (process.env.ADMIN_EMAIL || 'admin@coorgcup.in').toLowerCase()
  if (!database.users.some((user) => user.email === email)) {
    database.users.push({
      id: createId('user'),
      email,
      name: 'Coorg Cup Admin',
      passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD || 'change-this-password', 12),
      role: 'admin',
      createdAt: new Date().toISOString(),
    })
    await saveDatabase(database)
  }
}

app.get('/api/health', (request, response) => response.json({ ok: true, service: 'coorg-cup-backend' }))

app.get('/api/products', async (request, response) => {
  const database = await loadDatabase()
  const products = database.products.filter((product) => product.active !== false)
  response.json({ products })
})

app.get('/api/products/:id', async (request, response) => {
  const database = await loadDatabase()
  const product = database.products.find((item) => item.id === request.params.id && item.active !== false)
  if (!product) return response.status(404).json({ error: 'Product not found' })
  response.json({ product })
})

app.post('/api/auth/register', async (request, response) => {
  const database = await loadDatabase()
  const email = requiredText(request.body.email, 'Email').toLowerCase()
  const password = requiredText(request.body.password, 'Password')
  const name = requiredText(request.body.name, 'Name')
  if (!email.includes('@') || password.length < 8) return response.status(400).json({ error: 'Use a valid email and a password of at least 8 characters' })
  if (database.users.some((user) => user.email === email)) return response.status(409).json({ error: 'An account with that email already exists' })
  const user = { id: createId('user'), email, name, passwordHash: await bcrypt.hash(password, 12), role: 'customer', createdAt: new Date().toISOString() }
  database.users.push(user)
  await saveDatabase(database)
  response.status(201).json({ user: publicUser(user), token: signToken(user) })
})

app.post('/api/auth/login', async (request, response) => {
  const database = await loadDatabase()
  const email = requiredText(request.body.email, 'Email').toLowerCase()
  const password = requiredText(request.body.password, 'Password')
  const user = database.users.find((candidate) => candidate.email === email)
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return response.status(401).json({ error: 'Invalid email or password' })
  response.json({ user: publicUser(user), token: signToken(user) })
})

app.get('/api/auth/me', authRequired, async (request, response) => {
  const database = await loadDatabase()
  const user = database.users.find((candidate) => candidate.id === request.auth.sub)
  if (!user) return response.status(404).json({ error: 'User not found' })
  response.json({ user: publicUser(user) })
})

app.get('/api/cart', authRequired, async (request, response) => {
  const database = await loadDatabase()
  response.json({ cart: hydrateCart(database, getCart(database, request.auth.sub)) })
})

app.post('/api/cart/items', authRequired, async (request, response) => {
  const database = await loadDatabase()
  const product = database.products.find((item) => item.id === request.body.productId && item.active !== false)
  const quantity = Number(request.body.quantity || 1)
  if (!product) return response.status(404).json({ error: 'Product not found' })
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) return response.status(400).json({ error: 'Quantity must be an integer between 1 and 20' })
  const cart = getCart(database, request.auth.sub)
  const existing = cart.items.find((item) => item.productId === product.id)
  if (existing) existing.quantity = Math.min(existing.quantity + quantity, 20)
  else cart.items.push({ productId: product.id, quantity })
  await saveDatabase(database)
  response.status(201).json({ cart: hydrateCart(database, cart) })
})

app.patch('/api/cart/items/:productId', authRequired, async (request, response) => {
  const database = await loadDatabase()
  const quantity = Number(request.body.quantity)
  if (!Number.isInteger(quantity) || quantity < 0 || quantity > 20) return response.status(400).json({ error: 'Quantity must be an integer between 0 and 20' })
  const cart = getCart(database, request.auth.sub)
  const item = cart.items.find((candidate) => candidate.productId === request.params.productId)
  if (!item) return response.status(404).json({ error: 'Cart item not found' })
  if (quantity === 0) cart.items = cart.items.filter((candidate) => candidate.productId !== request.params.productId)
  else item.quantity = quantity
  await saveDatabase(database)
  response.json({ cart: hydrateCart(database, cart) })
})

app.delete('/api/cart/items/:productId', authRequired, async (request, response) => {
  const database = await loadDatabase()
  const cart = getCart(database, request.auth.sub)
  cart.items = cart.items.filter((item) => item.productId !== request.params.productId)
  await saveDatabase(database)
  response.json({ cart: hydrateCart(database, cart) })
})

app.post('/api/orders', authRequired, async (request, response) => {
  const database = await loadDatabase()
  const cart = getCart(database, request.auth.sub)
  const hydratedCart = hydrateCart(database, cart)
  if (!hydratedCart.items.length) return response.status(400).json({ error: 'Your cart is empty' })
  const order = {
    id: createId('order'),
    userId: request.auth.sub,
    items: hydratedCart.items.map(({ product, quantity, lineTotal }) => ({ productId: product.id, name: product.name, price: product.price, quantity, lineTotal })),
    subtotal: hydratedCart.subtotal,
    status: 'pending_payment',
    shippingAddress: request.body.shippingAddress || null,
    createdAt: new Date().toISOString(),
  }
  database.orders.push(order)
  cart.items = []
  await saveDatabase(database)
  response.status(201).json({ order })
})

app.get('/api/orders', authRequired, async (request, response) => {
  const database = await loadDatabase()
  response.json({ orders: database.orders.filter((order) => order.userId === request.auth.sub) })
})

app.post('/api/payments/checkout', authRequired, async (request, response) => {
  const database = await loadDatabase()
  const cart = hydrateCart(database, getCart(database, request.auth.sub))
  if (!cart.items.length) return response.status(400).json({ error: 'Your cart is empty' })
  if (!stripe) return response.json({ provider: 'local', checkoutUrl: null, message: 'Stripe is not configured. Add STRIPE_SECRET_KEY to enable hosted checkout.' })
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: cart.items.map((item) => ({ price_data: { currency: 'inr', product_data: { name: item.product.name }, unit_amount: item.product.price * 100 }, quantity: item.quantity })),
    success_url: `${frontendUrl}/?payment=success`,
    cancel_url: `${frontendUrl}/?payment=cancelled`,
    metadata: { userId: request.auth.sub },
  })
  response.json({ provider: 'stripe', checkoutUrl: session.url, sessionId: session.id })
})

app.get('/api/admin/products', authRequired, adminRequired, async (request, response) => {
  const database = await loadDatabase()
  response.json({ products: database.products })
})

app.post('/api/admin/products', authRequired, adminRequired, async (request, response) => {
  const database = await loadDatabase()
  const product = { id: createId('product'), name: requiredText(request.body.name, 'Name'), roast: request.body.roast || '', notes: request.body.notes || '', price: Number(request.body.price), weight: request.body.weight || '250g', image: request.body.image || '', tag: request.body.tag || '', active: request.body.active !== false }
  if (!Number.isFinite(product.price) || product.price <= 0) return response.status(400).json({ error: 'Price must be a positive number' })
  database.products.push(product)
  await saveDatabase(database)
  response.status(201).json({ product })
})

app.patch('/api/admin/products/:id', authRequired, adminRequired, async (request, response) => {
  const database = await loadDatabase()
  const product = database.products.find((item) => item.id === request.params.id)
  if (!product) return response.status(404).json({ error: 'Product not found' })
  Object.assign(product, request.body)
  if (request.body.price !== undefined && (!Number.isFinite(Number(product.price)) || Number(product.price) <= 0)) return response.status(400).json({ error: 'Price must be a positive number' })
  await saveDatabase(database)
  response.json({ product })
})

app.delete('/api/admin/products/:id', authRequired, adminRequired, async (request, response) => {
  const database = await loadDatabase()
  const product = database.products.find((item) => item.id === request.params.id)
  if (!product) return response.status(404).json({ error: 'Product not found' })
  product.active = false
  await saveDatabase(database)
  response.json({ product })
})

app.get('/api/admin/orders', authRequired, adminRequired, async (request, response) => {
  const database = await loadDatabase()
  response.json({ orders: database.orders })
})

app.patch('/api/admin/orders/:id', authRequired, adminRequired, async (request, response) => {
  const database = await loadDatabase()
  const order = database.orders.find((item) => item.id === request.params.id)
  if (!order) return response.status(404).json({ error: 'Order not found' })
  const allowedStatuses = ['pending_payment', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']
  if (!allowedStatuses.includes(request.body.status)) return response.status(400).json({ error: 'Invalid order status' })
  order.status = request.body.status
  await saveDatabase(database)
  response.json({ order })
})

app.use((error, request, response, next) => {
  console.error(error)
  response.status(400).json({ error: error.message || 'Request failed' })
})

bootstrapAdmin().then(() => {
  app.listen(port, () => console.log(`Coorg Cup API running on http://localhost:${port}`))
}).catch((error) => {
  console.error('Could not start API', error)
  process.exitCode = 1
})
