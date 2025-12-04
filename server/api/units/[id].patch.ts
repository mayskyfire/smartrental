import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const id = getRouterParam(event, 'id')
  const { unitCode, floor, areaSqm, baseRentAmount, status } = await readBody(event)

  if (!unitCode || !baseRentAmount) {
    throw createError({ statusCode: 400, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' })
  }

  try {
    const unit = await prisma.unit.update({
      where: { id },
      data: {
        unitCode,
        floor: floor ? parseInt(floor) : null,
        areaSqm: areaSqm ? parseFloat(areaSqm) : null,
        baseRentAmount: parseFloat(baseRentAmount),
        status
      },
      include: {
        property: true
      }
    })

    return { success: true, unit }
  } catch (error) {
    if (error.code === 'P2002') {
      throw createError({ statusCode: 400, message: 'รหัสห้องนี้มีอยู่แล้วในอาคารนี้' })
    }
    throw createError({ statusCode: 500, message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล' })
  }
})