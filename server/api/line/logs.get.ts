import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const logs = await prisma.lineMessageLog.findMany({
    include: {
      tenant: true,
      invoice: true
    },
    orderBy: { sentAt: 'desc' },
    take: 50
  })

  return { logs }
})
