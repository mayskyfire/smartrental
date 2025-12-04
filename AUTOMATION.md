# ระบบสร้างใบแจ้งหนี้อัตโนมัติ

## ภาพรวม

ระบบนี้จะสร้างใบแจ้งหนี้รายเดือนอัตโนมัติสำหรับสัญญาเช่าที่ใช้งานอยู่ และอัปเดตสถานะใบแจ้งหนี้ที่เกินกำหนดชำระ

## คุณสมบัติหลัก

### 1. การสร้างใบแจ้งหนี้อัตโนมัติ
- **เวลา**: วันที่ 1 ของทุกเดือน เวลา 00:00 น.
- **การทำงาน**: สร้างใบแจ้งหนี้สำหรับสัญญาเช่าที่ใช้งานอยู่ทั้งหมด
- **การตรวจสอบ**: ตรวจสอบว่าใบแจ้งหนี้สำหรับเดือนนั้นมีอยู่แล้วหรือไม่
- **ข้อมูลที่สร้าง**:
  - ช่วงเวลาการเรียกเก็บ (วันที่ 1 ถึงวันสุดท้ายของเดือน)
  - วันครบกำหนดชำระ (ตามที่กำหนดในสัญญาเช่า)
  - จำนวนเงิน (ค่าเช่ารายเดือนตามสัญญา)

### 2. การอัปเดตสถานะเกินกำหนด
- **เวลา**: ทุกวัน เวลา 06:00 น.
- **การทำงาน**: ตรวจสอบและอัปเดตสถานะใบแจ้งหนี้ที่เกินกำหนดชำระ
- **เงื่อนไข**: ใบแจ้งหนี้ที่มีสถานะ PENDING หรือ PARTIALLY_PAID และเกินวันครบกำหนด

## การตั้งค่า

### Environment Variables

```env
# เปิด/ปิดระบบอัตโนมัติ
AUTO_INVOICE_ENABLED="true"
AUTO_INVOICE_CRON="0 0 1 * *"  # 1st of every month at 00:00

AUTO_OVERDUE_CHECK_ENABLED="true"
AUTO_OVERDUE_CHECK_CRON="0 6 * * *"  # Daily at 06:00

TIMEZONE="Asia/Bangkok"
```

### Cron Expression Format

```
* * * * *
│ │ │ │ │
│ │ │ │ └─── วันในสัปดาห์ (0-7, 0 และ 7 = อาทิตย์)
│ │ │ └───── เดือน (1-12)
│ │ └─────── วันที่ (1-31)
│ └───────── ชั่วโมง (0-23)
└─────────── นาที (0-59)
```

## การใช้งาน

### 1. การตรวจสอบสถานะ

```bash
# ตรวจสอบสถานะการสร้างใบแจ้งหนี้
GET /api/invoices/auto-status?year=2025&month=3
```

### 2. การสร้างใบแจ้งหนี้แบบ Manual

```bash
# สร้างใบแจ้งหนี้สำหรับเดือนที่กำหนด
POST /api/invoices/trigger-generation
{
  "year": 2025,
  "month": 3,
  "force": false
}
```

### 3. การรัน Task แบบ Manual

```bash
# สร้างใบแจ้งหนี้
npx nuxi task monthly-invoice-generation

# อัปเดตสถานะเกินกำหนด
npx nuxi task update-overdue-invoices
```

## หน้าจัดการระบบ

เข้าใช้งานผ่าน: `/auto-invoices`

**คุณสมบัติ**:
- ตรวจสอบสถานะการสร้างใบแจ้งหนี้รายเดือน
- สร้างใบแจ้งหนี้แบบ Manual
- ดูรายการใบแจ้งหนี้ที่สร้างแล้ว
- ดูรายการที่รอการสร้าง

## การทำงานของระบบ

### 1. Monthly Invoice Generation Task

```typescript
// server/tasks/monthly-invoice.ts
export default defineTask({
  meta: {
    name: 'monthly-invoice-generation',
    cron: '0 0 1 * *'  // 1st of every month at 00:00
  },
  async run() {
    // 1. ดึงสัญญาเช่าที่ใช้งานอยู่
    // 2. ตรวจสอบใบแจ้งหนี้ที่มีอยู่แล้ว
    // 3. สร้างใบแจ้งหนี้ใหม่สำหรับที่ยังไม่มี
    // 4. บันทึกผลลัพธ์
  }
})
```

### 2. Overdue Invoice Update Task

```typescript
// server/tasks/update-overdue-invoices.ts
export default defineTask({
  meta: {
    name: 'update-overdue-invoices',
    cron: '0 6 * * *'  // Daily at 06:00
  },
  async run() {
    // 1. ค้นหาใบแจ้งหนี้ที่เกินกำหนด
    // 2. อัปเดตสถานะเป็น OVERDUE
    // 3. บันทึกผลลัพธ์
  }
})
```

## การ Monitor และ Logging

### Log Messages

```
[Task] Starting monthly invoice generation for 2025-03
[Task] Found 25 active leases
[Task] Monthly invoice generation completed: created: 23, skipped: 2, errors: 0

[Task] Checking for overdue invoices as of 2025-03-15
[Task] Found 5 overdue invoices
[Task] Overdue invoice update completed: updated: 5, errors: 0
```

### Response Format

```json
{
  "success": true,
  "timestamp": "2025-03-01T00:00:00.000Z",
  "period": "2025-03",
  "totalLeases": 25,
  "created": 23,
  "skipped": 2,
  "errors": 0,
  "details": {
    "created": [...],
    "skipped": [...],
    "errors": [...]
  }
}
```

## การแก้ไขปัญหา

### 1. Task ไม่ทำงาน
- ตรวจสอบ `AUTO_INVOICE_ENABLED` ใน .env
- ตรวจสอบ cron expression
- ตรวจสอบ timezone setting

### 2. ใบแจ้งหนี้ไม่ถูกสร้าง
- ตรวจสอบสัญญาเช่ามีสถานะ ACTIVE
- ตรวจสอบการเชื่อมต่อฐานข้อมูล
- ดู log ข้อผิดพลาดใน console

### 3. การรัน Manual
```bash
# ตรวจสอบ task ที่มี
npx nuxi task --list

# รัน task เฉพาะ
npx nuxi task monthly-invoice-generation
```

## การ Deploy Production

### 1. ตั้งค่า Environment
```env
NODE_ENV=production
AUTO_INVOICE_ENABLED=true
TIMEZONE=Asia/Bangkok
```

### 2. ตั้งค่า Process Manager (PM2)
```json
{
  "name": "condo-rent-system",
  "script": ".output/server/index.mjs",
  "env": {
    "NODE_ENV": "production",
    "NITRO_PORT": 3000
  }
}
```

### 3. ตั้งค่า System Cron (ทางเลือก)
```bash
# เพิ่มใน crontab
0 0 1 * * curl -X POST http://localhost:3000/api/invoices/trigger-generation -H "Content-Type: application/json" -d '{"year": $(date +\%Y), "month": $(date +\%m)}'
```

## การบำรุงรักษา

### 1. การตรวจสอบประจำ
- ตรวจสอบ log การทำงานของ task
- ตรวจสอบจำนวนใบแจ้งหนี้ที่สร้างในแต่ละเดือน
- ตรวจสอบสถานะใบแจ้งหนี้เกินกำหนด

### 2. การ Backup
- สำรองข้อมูลฐานข้อมูลก่อนการสร้างใบแจ้งหนี้รายเดือน
- เก็บ log การทำงานของระบบ

### 3. การ Update
- ทดสอบการทำงานของ task หลังจาก update
- ตรวจสอบ cron expression หลังจากเปลี่ยน timezone