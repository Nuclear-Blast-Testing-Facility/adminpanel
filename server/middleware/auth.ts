import { verifyToken } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // Public paths that do not require admin authentication
  const isPublicAuthPath = (
    path === '/api/auth/login' ||
    path === '/api/auth/session' ||
    path === '/api/auth/logout' ||
    path === '/api/health'
  )

  // Protect all admin data endpoints (GET, POST, PUT, DELETE)
  const isApiAdminPath = path.startsWith('/api/') && !isPublicAuthPath

  if (isApiAdminPath) {
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

    // Attach authenticated user to request context
    event.context.user = payload.user
  }
})
