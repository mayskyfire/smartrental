import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const id = getRouterParam(event, 'id')
  const { name, code, address, description } = await readBody(event)

  if (!name || !code || !address) {
    throw createError({ statusCode: 400, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' })
  }

  try {
    const property = await prisma.property.update({
      where: { id },
      data: { name, code, address, description }
    })

    return { success: true, property }
  } catch (error) {
    if (error.code === 'P2002') {
      throw createError({ statusCode: 400, message: 'รหัสอาคารนี้มีอยู่แล้ว' })
    }
    throw createError({ statusCode: 500, message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล' })
  }
})