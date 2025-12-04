import { deleteSession, clearSessionCookie } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  const sessionId = getCookie(event, 'session')
  if (sessionId) {
    deleteSession(sessionId)
  }
  clearSessionCookie(event)
  return { success: true }
})
