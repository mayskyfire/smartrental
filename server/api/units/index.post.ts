import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const { propertyId, unitCode, floor, areaSqm, baseRentAmount, status } = await readBody(event)

  if (!propertyId || !unitCode || !baseRentAmount) {
    throw createError({ statusCode: 400, message: 'PropertyId, unitCode, and baseRentAmount are required' })
  }

  const unit = await prisma.unit.create({
    data: { propertyId, unitCode, floor, areaSqm, baseRentAmount, status: status || 'VACANT' }
  })

  return { unit }
})
