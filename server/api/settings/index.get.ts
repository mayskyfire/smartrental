import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const settings = await prisma.systemSetting.findMany()
  
  const settingsMap: Record<string, string> = {}
  settings.forEach(s => {
    settingsMap[s.key] = s.value
  })

  return {
    lineChannelAccessToken: settingsMap['LINE_CHANNEL_ACCESS_TOKEN'] || '',
    lineChannelSecret: settingsMap['LINE_CHANNEL_SECRET'] || '',
    autoLineReminderEnabled: settingsMap['AUTO_LINE_REMINDER_ENABLED'] === 'true',
    autoLineReminderCron: settingsMap['AUTO_LINE_REMINDER_CRON'] || '0 9 * * *'
  }
})
