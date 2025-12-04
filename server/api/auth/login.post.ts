import bcrypt from 'bcrypt'
import { prisma } from '~/server/utils/prisma'
import { createSession, setSessionCookie } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body || {}

    if (!email || !password) {
      throw createError({ statusCode: 400, message: 'Email and password required' })
    }

    // Test database connection
    await prisma.$connect()
    
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      throw createError({ statusCode: 401, message: 'Invalid credentials' })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      throw createError({ statusCode: 401, message: 'Invalid credentials' })
    }

    const sessionId = createSession(user.id)
    setSessionCookie(event, sessionId)

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({ 
      statusCode: 500, 
      message: 'Internal server error: ' + error.message 
    })
  }
})
