import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const updates = [
    { key: 'LINE_CHANNEL_ACCESS_TOKEN', value: body.lineChannelAccessToken || '' },
    { key: 'LINE_CHANNEL_SECRET', value: body.lineChannelSecret || '' },
    { key: 'AUTO_LINE_REMINDER_ENABLED', value: body.autoLineReminderEnabled ? 'true' : 'false' },
    { key: 'AUTO_LINE_REMINDER_CRON', value: body.autoLineReminderCron || '0 9 * * *' }
  ]

  for (const update of updates) {
    await prisma.systemSetting.upsert({
      where: { key: update.key },
      update: { value: update.value },
      create: { key: update.key, value: update.value }
    })
  }

  return { success: true }
})
