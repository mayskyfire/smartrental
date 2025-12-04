import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const body = await readBody(event)
  const { year, month, force = false } = body

  if (!year || !month || month < 1 || month > 12) {
    throw createError({ 
      statusCode: 400, 
      message: 'กรุณาระบุปีและเดือนที่ถูกต้อง' 
    })
  }

  try {
    console.log(`[Manual Trigger] Generating invoices for ${year}-${month}`)
    
    // Run the monthly invoice generation task
    const result = await runTask('monthly-invoice-generation', {
      payload: { year, month, force }
    })

    return {
      success: true,
      message: `สร้างใบแจ้งหนี้สำหรับเดือน ${month}/${year} เรียบร้อยแล้ว`,
      result
    }
  } catch (error) {
    console.error('[Manual Trigger] Error:', error)
    throw createError({
      statusCode: 500,
      message: `เกิดข้อผิดพลาดในการสร้างใบแจ้งหนี้: ${error.message}`
    })
  }
})