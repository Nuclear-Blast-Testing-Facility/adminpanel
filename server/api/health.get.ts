import { getRedisClient } from '../utils/adminRedis'

export default defineEventHandler(async () => {
  const redis = getRedisClient()
  return {
    status: 'ok',
    service: 'adminpanel-nbtf-ca',
    timestamp: new Date().toISOString(),
    redisMode: redis.type
  }
})
