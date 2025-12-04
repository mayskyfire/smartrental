export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return

  const publicPages = ['/login']
  const isPublicPage = publicPages.includes(to.path)

  if (isPublicPage) return

  try {
    const { user } = await $fetch('/api/auth/me')
    if (!user) {
      return navigateTo('/login')
    }
  } catch (error) {
    return navigateTo('/login')
  }
})
