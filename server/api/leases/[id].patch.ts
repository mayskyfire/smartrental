import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const id = getRouterParam(event, 'id')
  const { 
    startDate, endDate, monthlyRentAmount, dueDayOfMonth, depositAmount,
    lateFeeStartDay, dailyLateFee, terminationDay, status 
  } = await readBody(event)

  if (!startDate || !monthlyRentAmount || !dueDayOfMonth) {
    throw createError({ statusCode: 400, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' })
  }

  try {
    const lease = await prisma.lease.update({
      where: { id },
      data: {
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        monthlyRentAmount: parseFloat(monthlyRentAmount),
        dueDayOfMonth: parseInt(dueDayOfMonth),
        depositAmount: parseFloat(depositAmount) || 0,
        lateFeeStartDay: parseInt(lateFeeStartDay) || 3,
        dailyLateFee: parseFloat(dailyLateFee) || 100,
        terminationDay: parseInt(terminationDay) || 30,
        status
      },
      include: {
        tenant: true,
        unit: {
          include: { property: true }
        }
      }
    })

    return { success: true, lease }
  } catch (error) {
    throw createError({ statusCode: 500, message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล' })
  }
})