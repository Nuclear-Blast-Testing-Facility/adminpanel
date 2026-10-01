export default defineEventHandler(async (event) => {
  deleteCookie(event, 'nbtf_admin_token', {
    path: '/'
  })

  return {
    success: true,
    message: 'Logged out successfully'
  }
})
