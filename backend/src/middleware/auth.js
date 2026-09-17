import jwt from 'jsonwebtoken'
import { jwtSecret } from '../config/env.js'

export function authRequired(request, response, next) {
  const token = request.headers.authorization?.replace('Bearer ', '')
  if (!token) return response.status(401).json({ error: 'Authentication required' })
  try {
    request.auth = jwt.verify(token, jwtSecret)
    next()
  } catch {
    return response.status(401).json({ error: 'Invalid or expired token' })
  }
}

export function adminRequired(request, response, next) {
  if (request.auth?.role !== 'admin') return response.status(403).json({ error: 'Admin access required' })
  next()
}
