import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const { year, month } = await readBody(event)

  if (!year || !month || month < 1 || month > 12) {
    throw createError({ statusCode: 400, message: 'Valid year and month required' })
  }

  const activeLeases = await prisma.lease.findMany({
    where: { status: 'ACTIVE' },
    include: {
      unit: {
        include: { property: true }
      }
    }
  })

  const created = []
  const skipped = []

  for (const lease of activeLeases) {
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
      skipped.push({ leaseId: lease.id, reason: 'Already exists' })
      continue
    }

    const billingPeriodStart = new Date(year, month - 1, 1)
    const billingPeriodEnd = new Date(year, month, 0)
    
    // คำนวณวันครบกำหนดตาม dueDayOfMonth
    const dueDate = new Date(year, month - 1, lease.dueDayOfMonth)
    if (dueDate < billingPeriodStart) {
      dueDate.setMonth(dueDate.getMonth() + 1)
    }

    // คำนวณวันที่เริ่มคิดค่าปรับ
    const lateFeeStartDate = new Date(dueDate)
    lateFeeStartDate.setDate(lateFeeStartDate.getDate() + lease.lateFeeStartDay)

    // คำนวณวันที่ยกเลิกสัญญา
    const terminationDate = new Date(dueDate)
    terminationDate.setDate(terminationDate.getDate() + lease.terminationDay)

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
        status: 'PENDING'
      }
    })

    created.push(invoice)
  }

  return {
    success: true,
    created: created.length,
    skipped: skipped.length,
    invoices: created
  }
})
