import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const tenants = await prisma.tenant.findMany({
    include: {
      leases: {
        where: { status: 'ACTIVE' },
        include: {
          unit: {
            include: { property: true }
          }
        }
      }
    },
    orderBy: { fullName: 'asc' }
  })

  return { tenants }
})
