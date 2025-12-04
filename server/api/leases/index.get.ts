import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const query = getQuery(event)
  const propertyId = query.propertyId as string | undefined

  const leases = await prisma.lease.findMany({
    where: propertyId ? { unit: { propertyId } } : undefined,
    select: {
      id: true,
      startDate: true,
      endDate: true,
      monthlyRentAmount: true,
      dueDayOfMonth: true,
      depositAmount: true,
      lateFeeStartDay: true,
      dailyLateFee: true,
      terminationDay: true,
      status: true,
      tenantId: true,
      unitId: true,
      tenant: {
        select: { id: true, fullName: true }
      },
      unit: {
        select: {
          id: true,
          unitCode: true,
          propertyId: true,
          property: {
            select: { id: true, name: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return { leases }
})
