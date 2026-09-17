import jwt from 'jsonwebtoken'
import { jwtSecret } from '../../config/env.js'

export function publicUser(user) {
  const { passwordHash, ...safeUser } = user
  return safeUser
}

export function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, email: user.email }, jwtSecret, { expiresIn: '7d' })
}
