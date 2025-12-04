// Test Prisma connection
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testing Prisma connection...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    // Test query
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in database`);
    
    // Test admin user
    const admin = await prisma.user.findFirst({
      where: { email: 'admin@example.com' }
    });
    
    if (admin) {
      console.log('✅ Admin user found:', admin.email);
    } else {
      console.log('⚠️ Admin user not found');
    }
    
  } catch (error) {
    console.error('❌ Prisma test failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();