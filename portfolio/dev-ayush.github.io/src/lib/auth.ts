import jwt from 'jsonwebtoken'

const DEFAULT_SECRET = 'dev-secret-change-me'

export function getAuthSecret() {
  return process.env.AUTH_SECRET || DEFAULT_SECRET
}

export function signToken(payload: object, opts: { expiresIn?: string } = {}) {
  // @ts-expect-error - JWT types conflict
  return jwt.sign(payload, getAuthSecret(), { expiresIn: opts.expiresIn || '7d' })
}

export function verifyToken<T = any>(token: string): T | null {
  try {
    return jwt.verify(token, getAuthSecret()) as T
  } catch {
    return null
  }
}

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com','10minutemail.com','guerrillamail.com','yopmail.com','tempmail.com','trashmail.com'
])

export function isValidEmailFormat(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isDisposableEmail(email: string) {
  const domain = email.split('@')[1]?.toLowerCase()
  return domain ? DISPOSABLE_DOMAINS.has(domain) : true
}
