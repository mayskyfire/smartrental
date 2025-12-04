// Nitro Scheduled Task for Calculating Late Fees
// Runs daily at 07:00 to calculate and update late fees

import { prisma } from '~/server/utils/prisma'

export default defineTask({
  meta: {
    name: 'calculate-late-fees',
    description: 'Calculate and update late fees for overdue invoices',
    // Run daily at 07:00
    cron: '0 7 * * *'
  },
  async run() {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    console.log(`[Task] Calculating late fees as of ${today.toISOString().split('T')[0]}`)

    try {
      // Find invoices that should have late fees calculated
      const invoicesForLateFee = await prisma.invoice.findMany({
        where: {
          lateFeeStartDate: {
            lte: today
          },
          status: {
            in: ['PENDING', 'PARTIALLY_PAID', 'OVERDUE']
          },
          paidAmount: {
            lt: prisma.invoice.fields.totalAmount
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

      console.log(`[Task] Found ${invoicesForLateFee.length} invoices for late fee calculation`)

      const updated = []
      const errors = []

      for (const invoice of invoicesForLateFee) {
        try {
          // Calculate days overdue from late fee start date
          const daysOverdue = Math.floor((today.getTime() - invoice.lateFeeStartDate!.getTime()) / (1000 * 60 * 60 * 24))
          
          if (daysOverdue > 0) {
            // Calculate new late fee
            const newLateFee = daysOverdue * invoice.lease.dailyLateFee
            const newTotalAmount = invoice.rentAmount + newLateFee
            
            // Update invoice only if late fee changed
            if (newLateFee !== invoice.lateFeeAmount) {
              const updatedInvoice = await prisma.invoice.update({
                where: { id: invoice.id },
                data: { 
                  lateFeeAmount: newLateFee,
                  totalAmount: newTotalAmount,
                  status: 'OVERDUE'
                }
              })

              updated.push({
                invoiceId: invoice.id,
                unitCode: invoice.lease.unit.unitCode,
                propertyName: invoice.lease.unit.property.name,
                tenantName: invoice.lease.tenant.fullName,
                dueDate: invoice.dueDate.toISOString().split('T')[0],
                lateFeeStartDate: invoice.lateFeeStartDate!.toISOString().split('T')[0],
                daysOverdue,
                dailyLateFee: invoice.lease.dailyLateFee,
                previousLateFee: invoice.lateFeeAmount,
                newLateFee,
                rentAmount: invoice.rentAmount,
                newTotalAmount
              })
            }
          }

        } catch (error) {
          console.error(`[Task] Error calculating late fee for invoice ${invoice.id}:`, error)
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
        totalChecked: invoicesForLateFee.length,
        updated: updated.length,
        errors: errors.length,
        details: {
          updated,
          errors
        }
      }

      console.log(`[Task] Late fee calculation completed:`, {
        updated: updated.length,
        errors: errors.length
      })

      return result

    } catch (error) {
      console.error('[Task] Failed to calculate late fees:', error)
      return { 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }
    }
  }
})

// To run manually: npx nuxi task calculate-late-fees
// Automatically runs daily at 07:00 via cron