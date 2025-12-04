import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const id = getRouterParam(event, 'id')

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      lease: {
        include: { tenant: true }
      },
      property: true,
      unit: true,
      payments: {
        orderBy: { paidDate: 'desc' }
      }
    }
  })

  if (!invoice) {
    throw createError({ statusCode: 404, message: 'Invoice not found' })
  }

  return { invoice }
})
