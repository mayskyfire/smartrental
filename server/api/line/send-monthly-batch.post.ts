import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'
import { sendLineMessage, formatInvoiceMessage } from '~/server/services/line.service'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const { year, month, propertyId } = await readBody(event)

  if (!year || !month) {
    throw createError({ statusCode: 400, message: 'Year and month required' })
  }

  const where: any = {
    billingYear: year,
    billingMonth: month,
    status: { in: ['PENDING', 'PARTIALLY_PAID'] }
  }

  if (propertyId) {
    where.propertyId = propertyId
  }

  const invoices = await prisma.invoice.findMany({
    where,
    include: {
      lease: { include: { tenant: true } },
      property: true,
      unit: true
    }
  })

  const results = []

  for (const invoice of invoices) {
    const tenant = invoice.lease.tenant
    if (!tenant.lineUserId) {
      results.push({ invoiceId: invoice.id, success: false, error: 'No LINE user ID' })
      continue
    }

    const message = formatInvoiceMessage(invoice, tenant, invoice.property, invoice.unit)
    const result = await sendLineMessage(tenant.lineUserId, message)

    await prisma.lineMessageLog.create({
      data: {
        tenantId: tenant.id,
        invoiceId: invoice.id,
        type: 'MONTHLY_REMINDER',
        messageContent: message,
        status: result.success ? 'SUCCESS' : 'FAILED',
        errorMessage: result.error
      }
    })

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        lineNotificationStatus: result.success ? 'SENT' : 'FAILED',
        lineLastError: result.error
      }
    })

    results.push({ invoiceId: invoice.id, success: result.success })
  }

  return {
    success: true,
    sent: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  }
})
