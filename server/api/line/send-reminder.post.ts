import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'
import { sendLineMessage, formatInvoiceMessage } from '~/server/services/line.service'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const { invoiceIds } = await readBody(event)

  if (!invoiceIds || !Array.isArray(invoiceIds)) {
    throw createError({ statusCode: 400, message: 'invoiceIds array required' })
  }

  const results = []

  for (const invoiceId of invoiceIds) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        lease: { include: { tenant: true } },
        property: true,
        unit: true
      }
    })

    if (!invoice) {
      results.push({ invoiceId, success: false, error: 'Invoice not found' })
      continue
    }

    const tenant = invoice.lease.tenant
    if (!tenant.lineUserId) {
      results.push({ invoiceId, success: false, error: 'Tenant has no LINE user ID' })
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
      where: { id: invoiceId },
      data: {
        lineNotificationStatus: result.success ? 'SENT' : 'FAILED',
        lineLastError: result.error
      }
    })

    results.push({ invoiceId, success: result.success, error: result.error })
  }

  return { results }
})
