export default defineEventHandler(async (event) => {
  const url = getRouterParam(event, '_') || event.node.req.url
  
  if (url?.startsWith('/.git')) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found'
    })
  }
})