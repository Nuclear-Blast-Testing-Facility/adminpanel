import { getWwwData, setWwwData } from '../utils/adminRedis'

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const data = await getWwwData()
    return {
      success: true,
      data
    }
  }

  if (event.method === 'POST') {
    const body = await readBody(event)
    const user = event.context.user || 'admin'
    const success = await setWwwData(body, user)
    return {
      success,
      message: success ? 'Game reference data saved to Redis successfully' : 'Failed to save to Redis'
    }
  }
})
