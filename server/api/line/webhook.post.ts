import { createHmac } from 'crypto'
import { prisma } from '~/server/utils/prisma'
import { replyLineMessage } from '~/server/services/line.service'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const signature = getHeader(event, 'x-line-signature')
  const body = await readRawBody(event)

  if (!signature || !body) {
    throw createError({ statusCode: 400, message: 'Invalid request' })
  }

  const hash = createHmac('SHA256', config.lineChannelSecret)
    .update(body)
    .digest('base64')

  if (hash !== signature) {
    throw createError({ statusCode: 401, message: 'Invalid signature' })
  }

  const data = JSON.parse(body)

  for (const webhookEvent of data.events) {
    if (webhookEvent.type === 'message' && webhookEvent.message.type === 'text') {
      const lineUserId = webhookEvent.source.userId
      const text = webhookEvent.message.text.trim()

      const tenant = await prisma.tenant.findUnique({
        where: { lineUserId }
      })

      if (!tenant) continue

      if (text.includes('ยอดค้างชำระ') || text.includes('ตรวจสอบยอด')) {
        const invoices = await prisma.invoice.findMany({
          where: {
            lease: { tenantId: tenant.id },
            status: { in: ['PENDING', 'PARTIALLY_PAID', 'OVERDUE'] }
          },
          include: {
            property: true,
            unit: true
          },
          orderBy: { dueDate: 'asc' }
        })

        if (invoices.length === 0) {
          await replyLineMessage(webhookEvent.replyToken, 'ไม่มียอดค้างชำระค่ะ ขอบคุณที่ชำระตรงเวลา 🙏')
        } else {
          const total = invoices.reduce((sum, inv) => sum + (inv.totalAmount - inv.paidAmount), 0)
          const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
          
          let reply = `คุณมียอดค่าเช่าค้างชำระทั้งหมด ${total.toLocaleString()} บาท\n\n`
          
          for (const inv of invoices) {
            const outstanding = inv.totalAmount - inv.paidAmount
            reply += `- ห้อง ${inv.unit.unitCode} ${inv.property.name}\n`
            reply += `  เดือน ${monthNames[inv.billingMonth - 1]} ${inv.billingYear + 543}: ${outstanding.toLocaleString()} บาท\n\n`
          }

          reply += 'กรุณาชำระภายในวันครบกำหนด ขอบคุณค่ะ'

          await replyLineMessage(webhookEvent.replyToken, reply)
        }
      }
    }
  }

  return { success: true }
})
