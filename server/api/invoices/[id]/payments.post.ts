import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const invoiceId = getRouterParam(event, 'id')
  const { amount, paidDate, method, note } = await readBody(event)

  if (!amount || amount <= 0) {
    throw createError({ statusCode: 400, message: 'Valid amount required' })
  }

  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } })
  if (!invoice) {
    throw createError({ statusCode: 404, message: 'Invoice not found' })
  }

  const payment = await prisma.payment.create({
    data: {
      invoiceId,
      amount,
      paidDate: paidDate ? new Date(paidDate) : new Date(),
      method: method || 'CASH',
      note
    }
  })

  const newPaidAmount = invoice.paidAmount + amount
  let newStatus = invoice.status

  if (newPaidAmount >= invoice.totalAmount) {
    newStatus = 'PAID'
  } else if (newPaidAmount > 0) {
    newStatus = 'PARTIALLY_PAID'
  }

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      paidAmount: newPaidAmount,
      status: newStatus
    }
  })

  return { payment }
})
