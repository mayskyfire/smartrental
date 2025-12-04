// Nitro Scheduled Task for Updating Overdue Invoice Status
// Runs daily at 06:00 to check and update overdue invoices

import { prisma } from '~/server/utils/prisma'

export default defineTask({
  meta: {
    name: 'update-overdue-invoices',
    description: 'Update invoice status to OVERDUE for invoices past due date',
    // Run daily at 06:00
    cron: '0 6 * * *'
  },
  async run() {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    console.log(`[Task] Checking for overdue invoices as of ${today.toISOString().split('T')[0]}`)

    try {
      // Find invoices that are past due date and not fully paid
      const overdueInvoices = await prisma.invoice.findMany({
        where: {
          dueDate: {
            lt: today
          },
          status: {
            in: ['PENDING', 'PARTIALLY_PAID']
          }
        },
        include: {
          lease: {
            include: {
              unit: {
                include: { property: true }
              },
              tenant: true
            }
          }
        }
      })

      console.log(`[Task] Found ${overdueInvoices.length} overdue invoices`)

      const updated = []
      const errors = []

      for (const invoice of overdueInvoices) {
        try {
          const updatedInvoice = await prisma.invoice.update({
            where: { id: invoice.id },
            data: { status: 'OVERDUE' }
          })

          updated.push({
            invoiceId: invoice.id,
            unitCode: invoice.lease.unit.unitCode,
            propertyName: invoice.lease.unit.property.name,
            tenantName: invoice.lease.tenant.fullName,
            dueDate: invoice.dueDate.toISOString().split('T')[0],
            amount: invoice.totalAmount,
            paidAmount: invoice.paidAmount,
            daysOverdue: Math.floor((today.getTime() - invoice.dueDate.getTime()) / (1000 * 60 * 60 * 24))
          })

        } catch (error) {
          console.error(`[Task] Error updating invoice ${invoice.id}:`, error)
          errors.push({
            invoiceId: invoice.id,
            error: error.message
          })
        }
      }

      const result = {
        success: true,
        timestamp: new Date().toISOString(),
        checkDate: today.toISOString().split('T')[0],
        totalChecked: overdueInvoices.length,
        updated: updated.length,
        errors: errors.length,
        details: {
          updated,
          errors
        }
      }

      console.log(`[Task] Overdue invoice update completed:`, {
        updated: updated.length,
        errors: errors.length
      })

      return result

    } catch (error) {
      console.error('[Task] Failed to update overdue invoices:', error)
      return { 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }
})

// To run manually: npx nuxi task update-overdue-invoices
// Automatically runs daily at 06:00 via cron