export default defineNuxtRouteMiddleware(async (to, from) => {
  if (to.path === '/login') {
    return
  }

  try {
    const session = await $fetch<{ authenticated: boolean }>('/api/auth/session')
    if (!session || !session.authenticated) {
      return navigateTo('/login')
    }
  } catch (err) {
    return navigateTo('/login')
  }
})
