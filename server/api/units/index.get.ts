import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const query = getQuery(event)
  const propertyId = query.propertyId as string | undefined

  const units = await prisma.unit.findMany({
    where: propertyId ? { propertyId } : undefined,
    select: {
      id: true,
      unitCode: true,
      floor: true,
      baseRentAmount: true,
      status: true,
      propertyId: true,
      property: {
        select: { id: true, name: true }
      },
      leases: {
        where: { status: 'ACTIVE' },
        select: {
          id: true,
          tenant: {
            select: { id: true, fullName: true }
          }
        },
        take: 1
      }
    },
    orderBy: { unitCode: 'asc' }
  })

  return { units }
})
