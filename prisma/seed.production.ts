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
      name: 'D-Condo Campus Hideaway',
      code: 'C-0001',
      address: '345 คลองหนึ่ง Khlong Luang District, Pathum Thani 12120'
    }
  })

  const property2 = await prisma.property.create({
    data: {
      name: 'XT Huaikhwang',
      code: 'C-0002',
      address: '298 แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพมหานคร 10310'
    }
  })

  const property3 = await prisma.property.create({
    data: {
      name: 'The Pivacy 101',
      code: 'C-0003',
      address: '506 ซอย ปุณณวิถี 16 แขวงบางจาก เขตพระโขนง กรุงเทพมหานคร 10260'
    }
  })

  const property4 = await prisma.property.create({
    data: {
      name: 'Plum Condo Ram 60 Interchange',
      code: 'C-0004',
      address: '26 แขวงหัวหมาก บางกะปิ กรุงเทพมหานคร 10240'
    }
  })

  // Create units
  const unit1 = await prisma.unit.create({
    data: {
      propertyId: property1.id,
      unitCode: '80-510',
      floor: 5,
      areaSqm: 35,
      baseRentAmount: 11500,
      status: 'OCCUPIED'
    }
  })

  const unit2 = await prisma.unit.create({
    data: {
      propertyId: property2.id,
      unitCode: '298-1305',
      floor: 10,
      areaSqm: 30,
      baseRentAmount: 17000,
      status: 'OCCUPIED'
    }
  })

  const unit3 = await prisma.unit.create({
    data: {
      propertyId: property3.id,
      unitCode: '456-159',
      floor: 7,
      areaSqm: 26,
      baseRentAmount: 10500,
      status: 'OCCUPIED'
    }
  })

  const unit4 = await prisma.unit.create({
    data: {
      propertyId: property4.id,
      unitCode: '8-950',
      floor: 5,
      areaSqm: 27,
      baseRentAmount: 10500,
      status: 'OCCUPIED'
    }
  })

  // Create tenants
  const tenant1 = await prisma.tenant.create({
    data: {
      fullName: 'ผู้เช่า',
      phone: '-',
      email: 'tenant1@example.com',
      lineUserId: 'U1234567890abcdef1234567890abcdef'
    }
  })

  const tenant2 = await prisma.tenant.create({
    data: {
      fullName: 'ผู้เช่า',
      phone: '-',
      email: 'tenant2@example.com',
      lineUserId: 'U0987654321fedcba0987654321fedcba'
    }
  })

  const tenant3 = await prisma.tenant.create({
    data: {
      fullName: 'ผู้เช่า',
      phone: '-',
      email: 'tenant3@example.com',
      lineUserId: 'U0987654321fedcba0987654321fedcbc'
    }
  })

  const tenant4 = await prisma.tenant.create({
    data: {
      fullName: 'ผู้เช่า',
      phone: '-',
      email: 'tenant4@example.com',
      lineUserId: 'U0987654321fedcba0987654321fedcbd'
    }
  })

  // Create leases
  const lease1 = await prisma.lease.create({
    data: {
      tenantId: tenant1.id,
      unitId: unit1.id,
      startDate: new Date('2025-12-10'),
      monthlyRentAmount: 11500,
      dueDayOfMonth: 10,
      depositAmount: 23000,
      lateFeeStartDay: 4,
      dailyLateFee: 300,
      terminationDay: 10,
      status: 'ACTIVE'
    }
  })

  const lease2 = await prisma.lease.create({
    data: {
      tenantId: tenant2.id,
      unitId: unit2.id,
      startDate: new Date('2025-12-06'),
      monthlyRentAmount: 17000,
      dueDayOfMonth: 6,
      depositAmount: 34000,
      lateFeeStartDay: 4,
      dailyLateFee: 200,
      terminationDay: 7,
      status: 'ACTIVE'
    }
  })

  const lease3 = await prisma.lease.create({
    data: {
      tenantId: tenant3.id,
      unitId: unit3.id,
      startDate: new Date('2025-12-28'),
      monthlyRentAmount: 10500,
      dueDayOfMonth: 28,
      depositAmount: 31000,
      lateFeeStartDay: 1,
      dailyLateFee: 500,
      terminationDay: 7,
      status: 'ACTIVE'
    }
  })

  const lease4 = await prisma.lease.create({
    data: {
      tenantId: tenant4.id,
      unitId: unit4.id,
      startDate: new Date('2025-12-05'),
      monthlyRentAmount: 8000,
      dueDayOfMonth: 5,
      depositAmount: 16000,
      lateFeeStartDay: 3,
      dailyLateFee: 500,
      terminationDay: 7,
      status: 'ACTIVE'
    }
  })

  console.log('✅ Seed completed successfully')
  console.log('Admin user:', admin.email, '/ password: admin123')
  console.log('Properties:', property1.name, property2.name, property3.name, property4.name)
  console.log('Units:', unit1.unitCode, unit2.unitCode, unit3.unitCode, unit4.unitCode)
  console.log('Tenants:', tenant1.fullName, tenant2.fullName, tenant3.fullName, tenant4.fullName)
  console.log('Leases:', lease1.id, lease2.id, lease3.id, lease4.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
