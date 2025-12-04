import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const query = getQuery(event)
  const year = query.year ? parseInt(query.year as string) : new Date().getFullYear()
  const month = query.month ? parseInt(query.month as string) : new Date().getMonth() + 1

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

  // Get existing invoices for the period
  const existingInvoices = await prisma.invoice.findMany({
    where: {
      billingYear: year,
      billingMonth: month
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

  // Calculate status
  const pending = []
  const generated = []

  for (const lease of activeLeases) {
    const existingInvoice = existingInvoices.find(inv => inv.leaseId === lease.id)
    
    if (existingInvoice) {
      generated.push({
        invoiceId: existingInvoice.id,
        leaseId: lease.id,
        unitCode: lease.unit.unitCode,
        propertyName: lease.unit.property.name,
        tenantName: lease.tenant.fullName,
        rentAmount: existingInvoice.rentAmount || existingInvoice.totalAmount,
        lateFeeAmount: existingInvoice.lateFeeAmount || 0,
        totalAmount: existingInvoice.totalAmount,
        amount: existingInvoice.totalAmount, // for backward compatibility
        dueDate: existingInvoice.dueDate.toISOString().split('T')[0],
        lateFeeStartDate: existingInvoice.lateFeeStartDate?.toISOString().split('T')[0],
        terminationDate: existingInvoice.terminationDate?.toISOString().split('T')[0],
        status: existingInvoice.status,
        createdAt: existingInvoice.createdAt
      })
    } else {
      pending.push({
        leaseId: lease.id,
        unitCode: lease.unit.unitCode,
        propertyName: lease.unit.property.name,
        tenantName: lease.tenant.fullName,
        monthlyRent: lease.monthlyRentAmount,
        dueDayOfMonth: lease.dueDayOfMonth,
        dailyLateFee: lease.dailyLateFee,
        lateFeeStartDay: lease.lateFeeStartDay,
        terminationDay: lease.terminationDay
      })
    }
  }

  return {
    success: true,
    period: `${year}-${String(month).padStart(2, '0')}`,
    summary: {
      totalActiveLeases: activeLeases.length,
      invoicesGenerated: generated.length,
      pendingGeneration: pending.length,
      completionRate: activeLeases.length > 0 ? Math.round((generated.length / activeLeases.length) * 100) : 0
    },
    details: {
      generated,
      pending
    }
  }
})