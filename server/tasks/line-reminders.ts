// Nitro Scheduled Task for LINE Reminders
// Runs daily to send reminders based on due dates

import { prisma } from '~/server/utils/prisma'
import { sendLineMessage, formatInvoiceMessage } from '~/server/services/line.service'

export default defineTask({
  meta: {
    name: 'line-reminders',
    description: 'Send LINE reminders for invoices based on due dates',
    // Run daily at 09:00
    cron: '0 9 * * *'
  },
  async run() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const threeDaysLater = new Date(today)
    threeDaysLater.setDate(threeDaysLater.getDate() + 3)



    // Find invoices that need reminders
    const invoices = await prisma.invoice.findMany({
      where: {
        status: { in: ['PENDING', 'PARTIALLY_PAID'] },
        OR: [
          // 3 days before due
          { dueDate: { gte: threeDaysLater, lt: new Date(threeDaysLater.getTime() + 86400000) } },
          // On due date
          { dueDate: { gte: today, lt: new Date(today.getTime() + 86400000) } },
          // 1 day overdue
          { dueDate: { gte: new Date(today.getTime() - 86400000), lt: today } },
          // 3 days overdue
          { dueDate: { gte: new Date(today.getTime() - 3 * 86400000), lt: new Date(today.getTime() - 2 * 86400000) } },
          // 7 days overdue
          { dueDate: { gte: new Date(today.getTime() - 7 * 86400000), lt: new Date(today.getTime() - 6 * 86400000) } }
        ]
      },
      include: {
        lease: { include: { tenant: true } },
        property: true,
        unit: true
      }
    })

    let sent = 0
    let failed = 0

    for (const invoice of invoices) {
      const tenant = invoice.lease.tenant
      if (!tenant.lineUserId) continue

      const daysUntilDue = Math.floor((new Date(invoice.dueDate).getTime() - today.getTime()) / 86400000)
      
      let messageType: any = 'MONTHLY_REMINDER'
      if (daysUntilDue === 3) messageType = 'REMINDER_BEFORE_DUE'
      else if (daysUntilDue === 0) messageType = 'ON_DUE_DATE'
      else if (daysUntilDue < 0) messageType = 'OVERDUE'

      const message = formatInvoiceMessage(invoice, tenant, invoice.property, invoice.unit)
      const result = await sendLineMessage(tenant.lineUserId, message)

      await prisma.lineMessageLog.create({
        data: {
          tenantId: tenant.id,
          invoiceId: invoice.id,
          type: messageType,
          messageContent: message,
          status: result.success ? 'SUCCESS' : 'FAILED',
          errorMessage: result.error
        }
      })

      if (result.success) sent++
      else failed++
    }


    return { result: 'success', sent, failed }
  }
})

// To run manually: npx nuxi task line-reminders
