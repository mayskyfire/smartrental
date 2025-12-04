export default defineNuxtPlugin(() => {
  if (process.client) {
    import('preline').then((module) => {
      if (module.HSStaticMethods) {
        module.HSStaticMethods.autoInit()
      }
    })
    
    // Re-initialize on route change
    const router = useRouter()
    router.afterEach(() => {
      nextTick(() => {
        import('preline').then((module) => {
          if (module.HSStaticMethods) {
            module.HSStaticMethods.autoInit()
          }
        })
      })
    })
  }
})