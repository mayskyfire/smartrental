import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const properties = await prisma.property.findMany({
    include: {
      _count: {
        select: { units: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return { properties }
})
