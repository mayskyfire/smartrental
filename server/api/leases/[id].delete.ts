import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const id = getRouterParam(event, 'id')

  try {
    // Check if lease has invoices
    const invoiceCount = await prisma.invoice.count({
      where: { leaseId: id }
    })

    if (invoiceCount > 0) {
      throw createError({ 
        statusCode: 400, 
        message: `ไม่สามารถลบได้ เนื่องจากมีใบแจ้งหนี้ ${invoiceCount} รายการ` 
      })
    }

    await prisma.lease.delete({
      where: { id }
    })

    return { success: true, message: 'ลบข้อมูลสัญญาเช่าเรียบร้อยแล้ว' }
  } catch (error) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, message: 'เกิดข้อผิดพลาดในการลบข้อมูล' })
  }
})