import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const { name, code, address, description } = await readBody(event)

  if (!name || !code || !address) {
    throw createError({ statusCode: 400, message: 'Name, code, and address are required' })
  }

  const property = await prisma.property.create({
    data: { name, code, address, description }
  })

  return { property }
})
