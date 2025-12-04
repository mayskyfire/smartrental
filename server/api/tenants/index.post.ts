import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const { fullName, phone, email, lineUserId, note } = await readBody(event)

  if (!fullName || !phone) {
    throw createError({ statusCode: 400, message: 'FullName and phone are required' })
  }

  const tenant = await prisma.tenant.create({
    data: { fullName, phone, email, lineUserId, note }
  })

  return { tenant }
})
