import { verifyToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'nbtf_admin_token') || getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) {
    return {
      authenticated: false,
      user: null
    }
  }

  const payload = verifyToken(token)

  if (payload && payload.user) {
    return {
      authenticated: true,
      user: {
        username: payload.user,
        role: payload.role || 'SUPER_ADMIN'
      }
    }
  }

  return {
    authenticated: false,
    user: null
  }
})
