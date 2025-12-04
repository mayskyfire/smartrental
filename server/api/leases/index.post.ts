import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const { tenantId, unitId, startDate, endDate, monthlyRentAmount, dueDayOfMonth, depositAmount } = await readBody(event)

  if (!tenantId || !unitId || !startDate || !monthlyRentAmount || !dueDayOfMonth) {
    throw createError({ statusCode: 400, message: 'Required fields missing' })
  }

  const lease = await prisma.lease.create({
    data: {
      tenantId,
      unitId,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      monthlyRentAmount,
      dueDayOfMonth,
      depositAmount: depositAmount || 0,
      status: 'ACTIVE'
    }
  })

  await prisma.unit.update({
    where: { id: unitId },
    data: { status: 'OCCUPIED' }
  })

  return { lease }
})
