import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const id = getRouterParam(event, 'id')
  const { fullName, phone, email, lineUserId, note } = await readBody(event)

  if (!fullName || !phone) {
    throw createError({ statusCode: 400, message: 'กรุณากรอกชื่อและเบอร์โทรศัพท์' })
  }

  try {
    const tenant = await prisma.tenant.update({
      where: { id },
      data: {
        fullName,
        phone,
        email: email || null,
        lineUserId: lineUserId || null,
        note: note || null
      }
    })

    return { success: true, tenant }
  } catch (error) {
    if (error.code === 'P2002') {
      throw createError({ statusCode: 400, message: 'LINE User ID นี้มีอยู่แล้ว' })
    }
    throw createError({ statusCode: 500, message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล' })
  }
})