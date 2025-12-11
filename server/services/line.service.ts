import { getLineSettings } from '../utils/settings'

export async function sendLineMessage(lineUserId: string, text: string): Promise<{ success: boolean; error?: string }> {
  const { lineChannelAccessToken } = await getLineSettings()

  if (!lineChannelAccessToken) {
    return { success: false, error: 'LINE_CHANNEL_ACCESS_TOKEN not configured' }
  }

  if (!lineUserId) {
    return { success: false, error: 'LINE User ID is empty' }
  }

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${lineChannelAccessToken}`
      },
      body: JSON.stringify({
        to: lineUserId,
        messages: [{ type: 'text', text }]
      })
    })

    const responseText = await response.text()

    if (!response.ok) {
      return { success: false, error: `LINE API error (${response.status}): ${responseText}` }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function replyLineMessage(replyToken: string, text: string): Promise<{ success: boolean; error?: string }> {
  const { lineChannelAccessToken } = await getLineSettings()

  if (!lineChannelAccessToken) {
    return { success: false, error: 'LINE_CHANNEL_ACCESS_TOKEN not configured' }
  }

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${lineChannelAccessToken}`
      },
      body: JSON.stringify({
        replyToken,
        messages: [{ type: 'text', text }]
      })
    })

    if (!response.ok) {
      const error = await response.text()
      return { success: false, error: `LINE API error: ${error}` }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export function formatInvoiceMessage(invoice: any, tenant: any, property: any, unit: any): string {
  const monthNames = ['ม.ค.', 'ก.ค.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
  const outstanding = invoice.totalAmount - invoice.paidAmount

  return `🏢 แจ้งเตือนค่าเช่า

คุณ${tenant.fullName}
โครงการ: ${property.name}
ห้อง: ${unit.unitCode}

เดือน: ${monthNames[invoice.billingMonth - 1]} ${invoice.billingYear + 543}
วันครบกำหนด: ${new Date(invoice.dueDate).toLocaleDateString('th-TH')}

ยอดค่าเช่า: ${invoice.totalAmount.toLocaleString()} บาท
ชำระแล้ว: ${invoice.paidAmount.toLocaleString()} บาท
คงค้าง: ${outstanding.toLocaleString()} บาท

กรุณาชำระภายในวันครบกำหนด ขอบคุณค่ะ`
}
