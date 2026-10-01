import { addAuditLog } from '../../utils/adminRedis'
import { signToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  const expectedUser = config.adminUsername || process.env.ADMIN_USERNAME || 'admin'
  const expectedPassword = config.adminPassword || process.env.ADMIN_PASSWORD || 'nbtf-2026-secure'

  const { username, password } = body || {}

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username and password are required'
    })
  }

  if (username === expectedUser && password === expectedPassword) {
    // Generate HMAC-SHA256 signed session token using ADMIN_SECRET_KEY
    const token = signToken({
      user: username,
      role: 'SUPER_ADMIN',
      timestamp: Date.now()
    })

    setCookie(event, 'nbtf_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    await addAuditLog({
      id: 'auth-' + Date.now(),
      action: 'Admin Login',
      target: 'system',
      timestamp: new Date().toISOString(),
      user: username,
      details: 'Successful administrator credential verification'
    })

    return {
      success: true,
      user: {
        username,
        role: 'SUPER_ADMIN'
      }
    }
  }

  // Failed login
  await addAuditLog({
    id: 'auth-fail-' + Date.now(),
    action: 'Failed Login Attempt',
    target: 'system',
    timestamp: new Date().toISOString(),
    user: username || 'unknown',
    details: 'Invalid access credentials supplied'
  })

  throw createError({
    statusCode: 401,
    statusMessage: 'Invalid administrator credentials'
  })
})
