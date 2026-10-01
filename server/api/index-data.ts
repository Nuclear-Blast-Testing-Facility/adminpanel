import { getDirectoryData, setDirectoryData } from '../utils/adminRedis'

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const data = await getDirectoryData()
    return {
      success: true,
      data
    }
  }

  if (event.method === 'POST') {
    const body = await readBody(event)
    const user = event.context.user || 'admin'
    const success = await setDirectoryData(body, user)
    return {
      success,
      message: success ? 'Directory data saved to Redis successfully' : 'Failed to save to Redis'
    }
  }
})
