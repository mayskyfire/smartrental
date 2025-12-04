import { prisma } from '~/server/utils/prisma'
import { requireAuth } from '~/server/utils/session'
import { sendLineMessage } from '~/server/services/line.service'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  
  const { tenantId, message } = await readBody(event)

  if (!tenantId || !message) {
    throw createError({ statusCode: 400, message: 'tenantId and message required' })
  }

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } })
  if (!tenant) {
    throw createError({ statusCode: 404, message: 'Tenant not found' })
  }

  if (!tenant.lineUserId) {
    throw createError({ statusCode: 400, message: 'Tenant has no LINE user ID' })
  }

  const result = await sendLineMessage(tenant.lineUserId, message)

  await prisma.lineMessageLog.create({
    data: {
      tenantId: tenant.id,
      type: 'MANUAL',
      messageContent: message,
      status: result.success ? 'SUCCESS' : 'FAILED',
      errorMessage: result.error
    }
  })

  return { success: result.success, error: result.error }
})
