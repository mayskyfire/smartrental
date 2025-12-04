import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: 'ADMIN'
    }
  })

  // Create properties
  const property1 = await prisma.property.create({
    data: {
      name: 'เดอะ พาร์ค คอนโดมิเนียม',
      code: 'PK001',
      address: '123 ถนนสุขุมวิท แขวงคลองตัน เขตวัฒนา กรุงเทพฯ 10110',
      description: 'คอนโดมิเนียมหรูใจกลางเมือง ใกล้ BTS อโศก'
    }
  })

  const property2 = await prisma.property.create({
    data: {
      name: 'บลู สกาย เรสซิเดนซ์',
      code: 'BS002',
      address: '456 ถนนรัชดาภิเษก แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310',
      description: 'คอนโดสไตล์โมเดิร์น วิวเมืองสวยงาม'
    }
  })

  const property3 = await prisma.property.create({
    data: {
      name: 'กรีน วิลเลจ คอนโด',
      code: 'GV003',
      address: '789 ถนนพระราม 4 แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
      description: 'คอนโดในบรรยากาศธรรมชาติ เงียบสงบ'
    }
  })

  // Create units for property 1
  const unit1 = await prisma.unit.create({
    data: {
      propertyId: property1.id,
      unitCode: 'A1201',
      floor: 12,
      areaSqm: 35,
      baseRentAmount: 15000,
      status: 'OCCUPIED'
    }
  })

  const unit2 = await prisma.unit.create({
    data: {
      propertyId: property1.id,
      unitCode: 'A1502',
      floor: 15,
      areaSqm: 42,
      baseRentAmount: 18000,
      status: 'VACANT'
    }
  })

  // Create units for property 2
  const unit3 = await prisma.unit.create({
    data: {
      propertyId: property2.id,
      unitCode: 'B0801',
      floor: 8,
      areaSqm: 30,
      baseRentAmount: 12000,
      status: 'OCCUPIED'
    }
  })

  const unit4 = await prisma.unit.create({
    data: {
      propertyId: property2.id,
      unitCode: 'B1003',
      floor: 10,
      areaSqm: 38,
      baseRentAmount: 14500,
      status: 'VACANT'
    }
  })

  // Create units for property 3
  const unit5 = await prisma.unit.create({
    data: {
      propertyId: property3.id,
      unitCode: 'C0505',
      floor: 5,
      areaSqm: 28,
      baseRentAmount: 10000,
      status: 'OCCUPIED'
    }
  })

  const unit6 = await prisma.unit.create({
    data: {
      propertyId: property3.id,
      unitCode: 'C0702',
      floor: 7,
      areaSqm: 32,
      baseRentAmount: 11500,
      status: 'VACANT'
    }
  })

  // Create tenants
  const tenant1 = await prisma.tenant.create({
    data: {
      fullName: 'นายสมชาย ใจดี',
      phone: '081-234-5678',
      email: 'somchai.jaidee@gmail.com',
      lineUserId: 'U1234567890abcdef1234567890abcdef',
      note: 'ผู้เช่าดี ชำระเงินตรงเวลา'
    }
  })

  const tenant2 = await prisma.tenant.create({
    data: {
      fullName: 'นางสาวมาลี สวยงาม',
      phone: '082-345-6789',
      email: 'malee.suayngam@hotmail.com',
      lineUserId: 'U0987654321fedcba0987654321fedcba',
      note: 'ทำงานบริษัทใหญ่ รายได้มั่นคง'
    }
  })

  const tenant3 = await prisma.tenant.create({
    data: {
      fullName: 'นายวิชัย เก่งมาก',
      phone: '083-456-7890',
      email: 'wichai.kengmak@yahoo.com',
      lineUserId: 'U1122334455aabbcc1122334455aabbcc',
      note: 'นักศึกษาปริญญาโท มหาวิทยาลัยชื่อดัง'
    }
  })

  // Create leases
  const lease1 = await prisma.lease.create({
    data: {
      tenantId: tenant1.id,
      unitId: unit1.id,
      startDate: new Date('2024-01-01'),
      monthlyRentAmount: 15000,
      dueDayOfMonth: 5,
      depositAmount: 30000,
      lateFeeStartDay: 3,
      dailyLateFee: 100,
      terminationDay: 30,
      status: 'ACTIVE'
    }
  })

  const lease2 = await prisma.lease.create({
    data: {
      tenantId: tenant2.id,
      unitId: unit3.id,
      startDate: new Date('2024-03-15'),
      monthlyRentAmount: 12000,
      dueDayOfMonth: 15,
      depositAmount: 24000,
      lateFeeStartDay: 5,
      dailyLateFee: 50,
      terminationDay: 30,
      status: 'ACTIVE'
    }
  })

  const lease3 = await prisma.lease.create({
    data: {
      tenantId: tenant3.id,
      unitId: unit5.id,
      startDate: new Date('2024-06-01'),
      monthlyRentAmount: 10000,
      dueDayOfMonth: 1,
      depositAmount: 20000,
      lateFeeStartDay: 3,
      dailyLateFee: 100,
      terminationDay: 30,
      status: 'ACTIVE'
    }
  })

  console.log('✅ Seed completed successfully')
  console.log('Admin user:', admin.email, '/ password: admin123')
  console.log('Properties:', property1.name, property2.name, property3.name)
  console.log('Units created: 6 units total')
  console.log('Tenants:', tenant1.fullName, tenant2.fullName, tenant3.fullName)
  console.log('Active leases: 3 contracts')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
