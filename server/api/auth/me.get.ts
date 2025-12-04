import { prisma } from '~/server/utils/prisma'
import { getAuthUser } from '~/server/utils/session'

export default defineEventHandler(async (event) => {
  const userId = await getAuthUser(event)
  
  if (!userId) {
    return { user: null }
  }
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true }
  })

  if (!user) {
    return { user: null }
  }

  return { user }
})
