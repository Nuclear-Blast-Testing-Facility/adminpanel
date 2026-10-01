import { verifyToken } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // Protect mutation / sensitive admin endpoints
  const isProtectedPath = (
    path.startsWith('/api/index-data') ||
    path.startsWith('/api/www-data') ||
    path.startsWith('/api/reset-defaults') ||
    path.startsWith('/api/audit-logs')
  ) && (event.method === 'POST' || event.method === 'PUT' || event.method === 'DELETE')

  if (isProtectedPath) {
    const token = getCookie(event, 'nbtf_admin_token') || getHeader(event, 'authorization')?.replace('Bearer ', '')

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Administrator authentication required'
      })
    }

    const payload = verifyToken(token)

    if (!payload || !payload.user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: Invalid, tampered, or expired session token'
      })
    }

    // Attach authenticated user to context
    event.context.user = payload.user
  }
})
