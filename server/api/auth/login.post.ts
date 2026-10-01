import { addAuditLog } from '../../utils/adminRedis'
import { signToken, getSecretKey } from '../../utils/auth'

// In-memory rate limiting tracker for failed attempts
const failedAttemptsMap = new Map<string, { count: number; lockedUntil: number }>()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  const isProd = process.env.NODE_ENV === 'production'

  const expectedUser = config.adminUsername || process.env.ADMIN_USERNAME || 'admin'
  const expectedPassword = config.adminPassword || process.env.ADMIN_PASSWORD || 'nbtf-2026-secure'

  if (!config.adminUsername && !process.env.ADMIN_USERNAME) {
    console.warn('[Admin Auth] Running with default administrative credentials. Configure ADMIN_USERNAME and ADMIN_PASSWORD in environment variables.')
  }

  // Rate-limiting check based on IP / client headers
  const clientIp = getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() || getRequestIP(event) || 'unknown'
  const attemptRecord = failedAttemptsMap.get(clientIp)
  const now = Date.now()

  if (attemptRecord && attemptRecord.lockedUntil > now) {
    const remainingSeconds = Math.ceil((attemptRecord.lockedUntil - now) / 1000)
    throw createError({
      statusCode: 429,
      statusMessage: `Too many failed attempts. Temporary cooldown in effect. Try again in ${remainingSeconds}s.`
    })
  }

  const { username, password } = body || {}

  if (!username || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username and password are required'
    })
  }

  // Constant-time check where possible and verification
  const isUserValid = Boolean(expectedUser && username === expectedUser)
  const isPasswordValid = Boolean(expectedPassword && password === expectedPassword)

  if (isUserValid && isPasswordValid) {
    // Reset rate-limiting tracker
    failedAttemptsMap.delete(clientIp)

    // Generate HMAC-SHA256 signed session token
    const token = signToken({
      user: username,
      role: 'SUPER_ADMIN',
      timestamp: Date.now()
    })

    setCookie(event, 'nbtf_admin_token', token, {
      httpOnly: true,
      secure: isProd,
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
      details: `Successful administrator authentication from IP: ${clientIp}`
    })

    return {
      success: true,
      user: {
        username,
        role: 'SUPER_ADMIN'
      }
    }
  }

  // Record failed attempt
  const currentAttempts = (attemptRecord?.count || 0) + 1
  let lockedUntil = 0
  if (currentAttempts >= 5) {
    lockedUntil = now + (60 * 1000 * 5) // 5 minute lock
  } else if (currentAttempts >= 3) {
    lockedUntil = now + (30 * 1000) // 30 second lock
  }

  failedAttemptsMap.set(clientIp, {
    count: currentAttempts,
    lockedUntil
  })

  // Simulated slight delay to prevent timing / brute force analysis
  await new Promise(resolve => setTimeout(resolve, 600))

  await addAuditLog({
    id: 'auth-fail-' + Date.now(),
    action: 'Failed Login Attempt',
    target: 'system',
    timestamp: new Date().toISOString(),
    user: username || 'unknown',
    details: `Failed credentials attempt (Count: ${currentAttempts}) from IP: ${clientIp}`
  })

  throw createError({
    statusCode: 401,
    statusMessage: 'Invalid administrator credentials'
  })
})
