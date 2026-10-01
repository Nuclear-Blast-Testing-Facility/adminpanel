import crypto from 'node:crypto'

export interface SessionPayload {
  user: string
  role: string
  timestamp: number
}

export function getSecretKey(): string {
  const config = useRuntimeConfig()
  return config.adminSecretKey || process.env.ADMIN_SECRET_KEY || 'nbtf-super-secret-jwt-key-2026'
}

export function signToken(payload: SessionPayload): string {
  const secret = getSecretKey()
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto.createHmac('sha256', secret).update(data).digest('base64url')
  return `${data}.${signature}`
}

export function verifyToken(token: string): SessionPayload | null {
  try {
    const [data, signature] = token.split('.')
    if (!data || !signature) return null

    const secret = getSecretKey()
    const expectedSignature = crypto.createHmac('sha256', secret).update(data).digest('base64url')

    // Constant-time comparison to prevent timing attacks
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null
    }

    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8')) as SessionPayload

    // Token expires after 7 days
    const maxAgeMs = 1000 * 60 * 60 * 24 * 7
    if (Date.now() - payload.timestamp > maxAgeMs) {
      return null
    }

    return payload
  } catch (err) {
    return null
  }
}
