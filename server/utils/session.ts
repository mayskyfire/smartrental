import type { H3Event } from 'h3'

const sessions = new Map<string, { userId: string; expiresAt: number }>()

export function createSession(userId: string): string {
  const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36)
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  sessions.set(sessionId, { userId, expiresAt })
  return sessionId
}

export function getUserSession(sessionId: string) {
  const session = sessions.get(sessionId)
  if (!session) return null
  if (session.expiresAt < Date.now()) {
    sessions.delete(sessionId)
    return null
  }
  return session
}

export function deleteSession(sessionId: string) {
  sessions.delete(sessionId)
}

export function setSessionCookie(event: H3Event, sessionId: string) {
  setCookie(event, 'session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60
  })
}

export function clearSessionCookie(event: H3Event) {
  deleteCookie(event, 'session')
}

export async function requireAuth(event: H3Event) {
  const sessionId = getCookie(event, 'session')
  if (!sessionId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
  
  const session = getUserSession(sessionId)
  if (!session) {
    throw createError({ statusCode: 401, message: 'Session expired' })
  }
  
  return session.userId
}

export async function getAuthUser(event: H3Event) {
  const sessionId = getCookie(event, 'session')
  if (!sessionId) return null
  
  const session = getUserSession(sessionId)
  if (!session) return null
  
  return session.userId
}
