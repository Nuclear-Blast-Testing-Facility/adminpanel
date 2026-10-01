export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === '/login') {
    return
  }

  // Check auth status
  try {
    const { data } = await useFetch('/api/auth/session')
    if (!data.value?.authenticated) {
      return navigateTo('/login')
    }
  } catch (err) {
    return navigateTo('/login')
  }
})
