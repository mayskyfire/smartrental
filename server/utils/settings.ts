import { prisma } from './prisma'

export async function getLineSettings() {
  const config = useRuntimeConfig()
  
  // Try to get from database first
  const settings = await prisma.systemSetting.findMany({
    where: {
      key: {
        in: ['LINE_CHANNEL_ACCESS_TOKEN', 'LINE_CHANNEL_SECRET', 'AUTO_LINE_REMINDER_ENABLED', 'AUTO_LINE_REMINDER_CRON']
      }
    }
  })

  const settingsMap: Record<string, string> = {}
  settings.forEach(s => {
    settingsMap[s.key] = s.value
  })

  // Fallback to env variables if not in database
  return {
    lineChannelAccessToken: settingsMap['LINE_CHANNEL_ACCESS_TOKEN'] || config.lineChannelAccessToken || '',
    lineChannelSecret: settingsMap['LINE_CHANNEL_SECRET'] || config.lineChannelSecret || '',
    autoLineReminderEnabled: settingsMap['AUTO_LINE_REMINDER_ENABLED'] === 'true' || config.autoLineReminderEnabled === 'true',
    autoLineReminderCron: settingsMap['AUTO_LINE_REMINDER_CRON'] || config.autoLineReminderCron || '0 9 * * *'
  }
}
