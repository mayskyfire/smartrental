export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip middleware during server-side rendering
  if (process.server) return

  try {
    await $fetch('/api/auth/me')
  } catch (error) {
    return navigateTo('/login')
  }
})