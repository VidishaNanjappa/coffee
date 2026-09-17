import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { createId, loadDatabase, saveDatabase } from '../../db/store.js'
import { requiredText } from '../../utils/validation.js'
import { authRequired } from '../../middleware/auth.js'
import { publicUser, signToken } from './auth.utils.js'

const router = Router()

router.post('/register', async (request, response) => {
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

router.post('/login', async (request, response) => {
  const database = await loadDatabase()
  const email = requiredText(request.body.email, 'Email').toLowerCase()
  const password = requiredText(request.body.password, 'Password')
  const user = database.users.find((candidate) => candidate.email === email)
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return response.status(401).json({ error: 'Invalid email or password' })
  response.json({ user: publicUser(user), token: signToken(user) })
})

router.get('/me', authRequired, async (request, response) => {
  const database = await loadDatabase()
  const user = database.users.find((candidate) => candidate.id === request.auth.sub)
  if (!user) return response.status(404).json({ error: 'User not found' })
  response.json({ user: publicUser(user) })
})

export default router
