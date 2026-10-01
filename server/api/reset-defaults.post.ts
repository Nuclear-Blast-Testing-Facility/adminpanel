import { resetAllToDefaults } from '../utils/adminRedis'

export default defineEventHandler(async (event) => {
  const user = event.context.user || 'admin'
  const success = await resetAllToDefaults(user)
  return {
    success,
    message: success ? 'Master data successfully reset to defaults' : 'Failed to reset data'
  }
})
