import { Redis as UpstashRedis } from '@upstash/redis'
import Redis from 'ioredis'
import { defaultDirectoryData, type DirectoryData } from './defaultDirectory'
import { defaultWwwData, type WwwSiteData } from './defaultGameData'

export { type DirectoryData, type DirectoryCategory, type DirectoryLink } from './defaultDirectory'
export { type WwwSiteData, type GameRole, type FacilityLocation, type TerminalLocation, type GamepassItem } from './defaultGameData'

export const REDIS_INDEX_KEY = 'nbtf:index:data'
export const REDIS_WWW_KEY = 'nbtf:www:data'
export const REDIS_AUDIT_LOGS_KEY = 'nbtf:admin:logs'

export interface AuditLogEntry {
  id: string
  action: string
  target: 'index' | 'www' | 'system'
  timestamp: string
  user: string
  details?: string
}

let ioredisClient: Redis | null = null
let upstashClient: UpstashRedis | null = null

// Memory cache fallback
let memoryIndexData: DirectoryData = JSON.parse(JSON.stringify(defaultDirectoryData))
let memoryWwwData: WwwSiteData = JSON.parse(JSON.stringify(defaultWwwData))
let memoryAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-init',
    action: 'System Initialized',
    target: 'system',
    timestamp: new Date().toISOString(),
    user: 'SYSTEM',
    details: 'Initial master configuration loaded'
  }
]

export function getRedisClient() {
  const config = useRuntimeConfig()
  
  // 1. Try Upstash REST
  const upstashUrl = config.upstashRedisRestUrl || process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = config.upstashRedisRestToken || process.env.UPSTASH_REDIS_REST_TOKEN
  if (upstashUrl && upstashToken) {
    if (!upstashClient) {
      upstashClient = new UpstashRedis({
        url: upstashUrl,
        token: upstashToken,
      })
    }
    return { type: 'upstash' as const, client: upstashClient }
  }

  // 2. Try standard Redis URL (ioredis)
  const redisUrl = config.redisUrl || process.env.REDIS_URL
  if (redisUrl) {
    if (!ioredisClient) {
      ioredisClient = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
        lazyConnect: true,
      })
    }
    return { type: 'ioredis' as const, client: ioredisClient }
  }

  // 3. Fallback memory mode
  return { type: 'memory' as const, client: null }
}

export async function getDirectoryData(): Promise<DirectoryData> {
  try {
    const redis = getRedisClient()
    if (redis.type === 'upstash' && redis.client) {
      const data = await redis.client.get<DirectoryData | string>(REDIS_INDEX_KEY)
      if (data) return typeof data === 'string' ? JSON.parse(data) : data
    } else if (redis.type === 'ioredis' && redis.client) {
      const raw = await redis.client.get(REDIS_INDEX_KEY)
      if (raw) return JSON.parse(raw)
    }
  } catch (err) {
    console.warn('[Admin Redis] Failed to get index data from Redis, using memory cache:', err)
  }
  return memoryIndexData
}

export async function setDirectoryData(data: DirectoryData, user = 'admin'): Promise<boolean> {
  try {
    data.updatedAt = new Date().toISOString()
    memoryIndexData = data
    const redis = getRedisClient()
    if (redis.type === 'upstash' && redis.client) {
      await redis.client.set(REDIS_INDEX_KEY, JSON.stringify(data))
    } else if (redis.type === 'ioredis' && redis.client) {
      await redis.client.set(REDIS_INDEX_KEY, JSON.stringify(data))
    }
    await addAuditLog({
      id: 'log-' + Date.now(),
      action: 'Updated Directory Data',
      target: 'index',
      timestamp: new Date().toISOString(),
      user,
      details: `Updated ${data.categories.length} categories with total ${data.categories.reduce((a, c) => a + c.links.length, 0)} endpoints`
    })
    return true
  } catch (err) {
    console.error('[Admin Redis] Error saving index data:', err)
    return false
  }
}

export async function getWwwData(): Promise<WwwSiteData> {
  try {
    const redis = getRedisClient()
    if (redis.type === 'upstash' && redis.client) {
      const data = await redis.client.get<WwwSiteData | string>(REDIS_WWW_KEY)
      if (data) return typeof data === 'string' ? JSON.parse(data) : data
    } else if (redis.type === 'ioredis' && redis.client) {
      const raw = await redis.client.get(REDIS_WWW_KEY)
      if (raw) return JSON.parse(raw)
    }
  } catch (err) {
    console.warn('[Admin Redis] Failed to get WWW data from Redis, using memory cache:', err)
  }
  return memoryWwwData
}

export async function setWwwData(data: WwwSiteData, user = 'admin'): Promise<boolean> {
  try {
    data.updatedAt = new Date().toISOString()
    memoryWwwData = data
    const redis = getRedisClient()
    if (redis.type === 'upstash' && redis.client) {
      await redis.client.set(REDIS_WWW_KEY, JSON.stringify(data))
    } else if (redis.type === 'ioredis' && redis.client) {
      await redis.client.set(REDIS_WWW_KEY, JSON.stringify(data))
    }
    await addAuditLog({
      id: 'log-' + Date.now(),
      action: 'Updated Game Reference & WWW Data',
      target: 'www',
      timestamp: new Date().toISOString(),
      user,
      details: `Updated ${data.roles.length} roles, ${data.locations.length} locations. Alert: ${data.bannerAlert?.level}`
    })
    return true
  } catch (err) {
    console.error('[Admin Redis] Error saving WWW data:', err)
    return false
  }
}

export async function getAuditLogs(): Promise<AuditLogEntry[]> {
  try {
    const redis = getRedisClient()
    if (redis.type === 'upstash' && redis.client) {
      const logs = await redis.client.get<AuditLogEntry[] | string>(REDIS_AUDIT_LOGS_KEY)
      if (logs) return typeof logs === 'string' ? JSON.parse(logs) : logs
    } else if (redis.type === 'ioredis' && redis.client) {
      const raw = await redis.client.get(REDIS_AUDIT_LOGS_KEY)
      if (raw) return JSON.parse(raw)
    }
  } catch (err) {
    console.warn('[Admin Redis] Failed to get audit logs from Redis:', err)
  }
  return memoryAuditLogs
}

export async function addAuditLog(entry: AuditLogEntry): Promise<void> {
  try {
    memoryAuditLogs.unshift(entry)
    if (memoryAuditLogs.length > 50) memoryAuditLogs = memoryAuditLogs.slice(0, 50)
    const redis = getRedisClient()
    if (redis.type === 'upstash' && redis.client) {
      await redis.client.set(REDIS_AUDIT_LOGS_KEY, JSON.stringify(memoryAuditLogs))
    } else if (redis.type === 'ioredis' && redis.client) {
      await redis.client.set(REDIS_AUDIT_LOGS_KEY, JSON.stringify(memoryAuditLogs))
    }
  } catch (err) {
    console.warn('[Admin Redis] Failed to save audit log entry:', err)
  }
}

export async function resetAllToDefaults(user = 'admin'): Promise<boolean> {
  const indexOk = await setDirectoryData(JSON.parse(JSON.stringify(defaultDirectoryData)), user)
  const wwwOk = await setWwwData(JSON.parse(JSON.stringify(defaultWwwData)), user)
  await addAuditLog({
    id: 'log-' + Date.now(),
    action: 'Reset System to Master Defaults',
    target: 'system',
    timestamp: new Date().toISOString(),
    user,
    details: 'All index directory and game data reverted to master source'
  })
  return indexOk && wwwOk
}
