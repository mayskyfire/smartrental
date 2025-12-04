// Nitro Scheduled Task for Monthly Invoice Generation
// Runs on the 1st of every month at 00:00

import { prisma } from '~/server/utils/prisma'

export default defineTask({
  meta: {
    name: 'monthly-invoice-generation',
    description: 'Generate monthly invoices for all active leases',
    // Run on 1st of every month at 00:00
    cron: '0 0 1 * *'
  },
  async run() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1

    console.log(`[Task] Starting monthly invoice generation for ${year}-${String(month).padStart(2, '0')}`)

    try {
      // Get all active leases
      const activeLeases = await prisma.lease.findMany({
        where: { status: 'ACTIVE' },
        include: {
          unit: {
            include: { property: true }
          },
          tenant: true
        }
      })

      console.log(`[Task] Found ${activeLeases.length} active leases`)

      const created = []
      const skipped = []
      const errors = []

      for (const lease of activeLeases) {
        try {
          // Check if invoice already exists
          const existing = await prisma.invoice.findUnique({
            where: {
              leaseId_billingYear_billingMonth: {
                leaseId: lease.id,
                billingYear: year,
                billingMonth: month
              }
            }
          })

          if (existing) {
            skipped.push({ 
              leaseId: lease.id, 
              unitCode: lease.unit.unitCode,
              tenantName: lease.tenant.fullName,
              reason: 'Invoice already exists' 
            })
            continue
          }

          // Calculate billing period
          const billingPeriodStart = new Date(year, month - 1, 1)
          const billingPeriodEnd = new Date(year, month, 0)
          
          // Calculate due date based on lease dueDayOfMonth
          const dueDate = new Date(year, month - 1, lease.dueDayOfMonth)
          if (dueDate < billingPeriodStart) {
            dueDate.setMonth(dueDate.getMonth() + 1)
          }

          // Calculate late fee start date
          const lateFeeStartDate = new Date(dueDate)
          lateFeeStartDate.setDate(lateFeeStartDate.getDate() + lease.lateFeeStartDay)

          // Calculate termination date
          const terminationDate = new Date(dueDate)
          terminationDate.setDate(terminationDate.getDate() + lease.terminationDay)

          // Create invoice
          const invoice = await prisma.invoice.create({
            data: {
              leaseId: lease.id,
              propertyId: lease.unit.propertyId,
              unitId: lease.unitId,
              billingYear: year,
              billingMonth: month,
              billingPeriodStart,
              billingPeriodEnd,
              dueDate,
              rentAmount: lease.monthlyRentAmount,
              lateFeeAmount: 0,
              totalAmount: lease.monthlyRentAmount,
              paidAmount: 0,
              lateFeeStartDate,
              terminationDate,
              status: 'PENDING',
              lineNotificationStatus: 'NOT_SENT'
            }
          })

          created.push({
            invoiceId: invoice.id,
            leaseId: lease.id,
            unitCode: lease.unit.unitCode,
            propertyName: lease.unit.property.name,
            tenantName: lease.tenant.fullName,
            amount: lease.monthlyRentAmount,
            dueDate: dueDate.toISOString().split('T')[0]
          })

        } catch (error) {
          console.error(`[Task] Error creating invoice for lease ${lease.id}:`, error)
          errors.push({
            leaseId: lease.id,
            unitCode: lease.unit.unitCode,
            tenantName: lease.tenant.fullName,
            error: error.message
          })
        }
      }

      const result = {
        success: true,
        timestamp: new Date().toISOString(),
        period: `${year}-${String(month).padStart(2, '0')}`,
        totalLeases: activeLeases.length,
        created: created.length,
        skipped: skipped.length,
        errors: errors.length,
        details: {
          created,
          skipped,
          errors
        }
      }

      console.log(`[Task] Monthly invoice generation completed:`, {
        created: created.length,
        skipped: skipped.length,
        errors: errors.length
      })

      return result

    } catch (error) {
      console.error('[Task] Failed to generate monthly invoices:', error)
      return { 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }
})

// To run manually: npx nuxi task monthly-invoice-generation
// Automatically runs on 1st of every month at 00:00 via cron
