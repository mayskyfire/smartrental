import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const id = getRouterParam(event, 'id')

  try {
    // Check if property has units
    const unitCount = await prisma.unit.count({
      where: { propertyId: id }
    })

    if (unitCount > 0) {
      throw createError({ 
        statusCode: 400, 
        message: `ไม่สามารถลบได้ เนื่องจากมีห้องเช่า ${unitCount} ห้องในอาคารนี้` 
      })
    }

    await prisma.property.delete({
      where: { id }
    })

    return { success: true, message: 'ลบข้อมูลอาคารเรียบร้อยแล้ว' }
  } catch (error) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, message: 'เกิดข้อผิดพลาดในการลบข้อมูล' })
  }
})