import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../../db/prisma.js'
import { requiredText } from '../../utils/validation.js'
import { authRequired } from '../../middleware/auth.js'
import { publicUser, signToken } from './auth.utils.js'

const router = Router()

router.post('/register', async (request, response) => {
  const email = requiredText(request.body.email, 'Email').toLowerCase()
  const password = requiredText(request.body.password, 'Password')
  const name = requiredText(request.body.name, 'Name')
  if (!email.includes('@') || password.length < 8) return response.status(400).json({ error: 'Use a valid email and a password of at least 8 characters' })
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return response.status(409).json({ error: 'An account with that email already exists' })
  const user = await prisma.user.create({ data: { email, name, passwordHash: await bcrypt.hash(password, 12), role: 'customer' } })
  response.status(201).json({ user: publicUser(user), token: signToken(user) })
})

router.post('/login', async (request, response) => {
  const email = requiredText(request.body.email, 'Email').toLowerCase()
  const password = requiredText(request.body.password, 'Password')
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return response.status(401).json({ error: 'Invalid email or password' })
  response.json({ user: publicUser(user), token: signToken(user) })
})

router.get('/me', authRequired, async (request, response) => {
  const user = await prisma.user.findUnique({ where: { id: request.auth.sub } })
  if (!user) return response.status(404).json({ error: 'User not found' })
  response.json({ user: publicUser(user) })
})

export default router
