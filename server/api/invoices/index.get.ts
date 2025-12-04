import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const query = getQuery(event)
  const propertyId = query.propertyId as string | undefined
  const status = query.status as string | undefined
  const year = query.year ? parseInt(query.year as string) : undefined
  const month = query.month ? parseInt(query.month as string) : undefined

  const where: any = {}
  if (propertyId) where.propertyId = propertyId
  if (status) where.status = status
  if (year) where.billingYear = year
  if (month) where.billingMonth = month

  const invoices = await prisma.invoice.findMany({
    where,
    select: {
      id: true,
      billingYear: true,
      billingMonth: true,
      dueDate: true,
      totalAmount: true,
      paidAmount: true,
      status: true,
      lease: {
        select: {
          tenant: {
            select: { id: true, fullName: true }
          }
        }
      },
      property: {
        select: { id: true, name: true }
      },
      unit: {
        select: { id: true, unitCode: true }
      }
    },
    orderBy: { dueDate: 'desc' },
    take: 100 // จำกัดแค่ 100 รายการล่าสุด
  })

  return { invoices }
})
