import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const id = getRouterParam(event, 'id')

  try {
    // Check if unit has active leases
    const leaseCount = await prisma.lease.count({
      where: { 
        unitId: id,
        status: 'ACTIVE'
      }
    })

    if (leaseCount > 0) {
      throw createError({ 
        statusCode: 400, 
        message: 'ไม่สามารถลบได้ เนื่องจากมีสัญญาเช่าที่ใช้งานอยู่' 
      })
    }

    await prisma.unit.delete({
      where: { id }
    })

    return { success: true, message: 'ลบข้อมูลห้องเช่าเรียบร้อยแล้ว' }
  } catch (error) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, message: 'เกิดข้อผิดพลาดในการลบข้อมูล' })
  }
})