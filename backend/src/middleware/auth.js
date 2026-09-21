import jwt from 'jsonwebtoken'
import { jwtSecret } from '../config/env.js'
import { prisma } from '../db/prisma.js'

export async function authRequired(request, response, next) {
  const token = request.headers.authorization?.replace('Bearer ', '')
  if (!token) return response.status(401).json({ error: 'Authentication required' })
  try {
    const payload = jwt.verify(token, jwtSecret)
    const user = await prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user) return response.status(401).json({ error: 'Session no longer valid, please sign in again' })
    request.auth = payload
    next()
  } catch {
    return response.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function adminRequired(request, response, next) {
  if (request.auth?.role !== 'admin') return response.status(403).json({ error: 'Admin access required' })
  next()
}
