import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connected successfully!')
    
    // Test query
    const userCount = await prisma.user.count()
    console.log(`📊 Found ${userCount} users in database`)
    
    // Test if admin user exists
    const adminUser = await prisma.user.findFirst({
      where: { email: 'admin@example.com' }
    })
    
    if (adminUser) {
      console.log('✅ Admin user exists:', adminUser.email)
    } else {
      console.log('⚠️ Admin user not found')
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()