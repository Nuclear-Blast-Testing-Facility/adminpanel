import { getAuditLogs } from '../utils/adminRedis'

export default defineEventHandler(async () => {
  const logs = await getAuditLogs()
  return {
    success: true,
    logs
  }
})
