# ระบบค่าปรับและการยกเลิกสัญญา

## ภาพรวม

ระบบนี้จัดการค่าปรับรายวันสำหรับการชำระค่าเช่าล่าช้า และกำหนดวันที่จะยกเลิกสัญญาหากไม่ชำระ

## ข้อมูลในสัญญาเช่า (Lease)

### ฟิลด์ใหม่ที่เพิ่มเข้ามา:

```typescript
{
  dueDayOfMonth: number,      // วันที่ครบกำหนดชำระในแต่ละเดือน (1-31)
  lateFeeStartDay: number,    // จำนวนวันหลังครบกำหนดที่เริ่มคิดค่าปรับ (default: 3)
  dailyLateFee: number,       // ค่าปรับรายวัน (default: 100 บาท)
  terminationDay: number      // จำนวนวันหลังครบกำหนดที่จะยกเลิกสัญญา (default: 30)
}
```

### ตัวอย่างข้อมูล:
```typescript
{
  dueDayOfMonth: 10,          // ครบกำหนดวันที่ 10 ของทุกเดือน
  lateFeeStartDay: 3,         // เริ่มคิดค่าปรับวันที่ 13 (10+3)
  dailyLateFee: 100,          // ค่าปรับ 100 บาท/วัน
  terminationDay: 30          // ยกเลิกสัญญาวันที่ 40 (10+30)
}
```

## ข้อมูลในใบแจ้งหนี้ (Invoice)

### ฟิลด์ใหม่ที่เพิ่มเข้ามา:

```typescript
{
  rentAmount: number,         // ค่าเช่าพื้นฐาน
  lateFeeAmount: number,      // ค่าปรับที่คิดแล้ว
  totalAmount: number,        // รวมทั้งหมด (rentAmount + lateFeeAmount)
  lateFeeStartDate: Date,     // วันที่เริ่มคิดค่าปรับ
  terminationDate: Date       // วันที่จะยกเลิกสัญญา
}
```

## การทำงานของระบบ

### 1. การสร้างใบแจ้งหนี้ (Monthly Invoice Generation)

**เวลา**: วันที่ 1 ของทุกเดือน เวลา 00:00

**การคำนวณ**:
```typescript
// วันครบกำหนดชำระ
const dueDate = new Date(year, month - 1, lease.dueDayOfMonth)

// วันที่เริ่มคิดค่าปรับ
const lateFeeStartDate = new Date(dueDate)
lateFeeStartDate.setDate(dueDate.getDate() + lease.lateFeeStartDay)

// วันที่จะยกเลิกสัญญา
const terminationDate = new Date(dueDate)
terminationDate.setDate(dueDate.getDate() + lease.terminationDay)
```

### 2. การคำนวณค่าปรับ (Late Fee Calculation)

**เวลา**: ทุกวัน เวลา 07:00

**การคำนวณ**:
```typescript
// หาจำนวนวันที่เกินจากวันเริ่มคิดค่าปรับ
const daysOverdue = Math.floor(
  (today.getTime() - lateFeeStartDate.getTime()) / (1000 * 60 * 60 * 24)
)

// คำนวณค่าปรับ
const lateFeeAmount = daysOverdue * lease.dailyLateFee

// อัปเดตยอดรวม
const totalAmount = rentAmount + lateFeeAmount
```

### 3. การอัปเดตสถานะเกินกำหนด (Overdue Status Update)

**เวลา**: ทุกวัน เวลา 06:00

**เงื่อนไข**: ใบแจ้งหนี้ที่เกินวันครบกำหนดและยังไม่ชำระเต็มจำนวน

## ตัวอย่างการใช้งาน

### สถานการณ์ที่ 1: การชำระตรงเวลา
```
วันครบกำหนด: 10 มี.ค. 2025
วันชำระ: 8 มี.ค. 2025
ผลลัพธ์: ไม่มีค่าปรับ
```

### สถานการณ์ที่ 2: การชำระล่าช้า (ยังไม่ถึงวันคิดค่าปรับ)
```
วันครบกำหนด: 10 มี.ค. 2025
วันเริ่มคิดค่าปรับ: 13 มี.ค. 2025
วันชำระ: 12 มี.ค. 2025
ผลลัพธ์: ไม่มีค่าปรับ (ยังไม่ถึงวันคิดค่าปรับ)
```

### สถานการณ์ที่ 3: การชำระล่าช้า (มีค่าปรับ)
```
วันครบกำหนด: 10 มี.ค. 2025
วันเริ่มคิดค่าปรับ: 13 มี.ค. 2025
วันชำระ: 18 มี.ค. 2025
จำนวนวันเกิน: 5 วัน (18-13)
ค่าปรับ: 5 × 100 = 500 บาท
```

### สถานการณ์ที่ 4: ถึงวันยกเลิกสัญญา
```
วันครบกำหนด: 10 มี.ค. 2025
วันยกเลิกสัญญา: 9 เม.ย. 2025
สถานะ: พร้อมยกเลิกสัญญา
```

## API Endpoints

### ตรวจสอบสถานะใบแจ้งหนี้
```http
GET /api/invoices/auto-status?year=2025&month=3
```

### สร้างใบแจ้งหนี้แบบ Manual
```http
POST /api/invoices/trigger-generation
{
  "year": 2025,
  "month": 3
}
```

### รัน Task แบบ Manual
```bash
# สร้างใบแจ้งหนี้
npx nuxi task monthly-invoice-generation

# คำนวณค่าปรับ
npx nuxi task calculate-late-fees

# อัปเดตสถานะเกินกำหนด
npx nuxi task update-overdue-invoices
```

## การตั้งค่า Environment Variables

```env
# เปิด/ปิดระบบอัตโนมัติ
AUTO_INVOICE_ENABLED="true"
AUTO_OVERDUE_CHECK_ENABLED="true"
AUTO_LATE_FEE_ENABLED="true"

# กำหนดเวลารัน
AUTO_INVOICE_CRON="0 0 1 * *"      # วันที่ 1 เวลา 00:00
AUTO_OVERDUE_CHECK_CRON="0 6 * * *" # ทุกวัน เวลา 06:00
AUTO_LATE_FEE_CRON="0 7 * * *"      # ทุกวัน เวลา 07:00

TIMEZONE="Asia/Bangkok"
```

## การแสดงผลในหน้า Dashboard

### ตารางใบแจ้งหนี้ที่สร้างแล้ว:
- หน่วย
- อาคาร
- ผู้เช่า
- ค่าเช่า
- ค่าปรับ
- รวม
- กำหนดชำระ
- วันเริ่มปรับ
- วันยกเลิก
- สถานะ

### ตารางรอการสร้าง:
- หน่วย
- อาคาร
- ผู้เช่า
- ค่าเช่า/เดือน
- วันครบกำหนด
- ค่าปรับ/วัน
- เริ่มปรับหลัง
- ยกเลิกหลัง

## การ Monitor และ Logging

### Log Messages สำหรับ Late Fee Calculation:
```
[Task] Calculating late fees as of 2025-03-15
[Task] Found 5 invoices for late fee calculation
[Task] Late fee calculation completed: updated: 3, errors: 0
```

### Response Format:
```json
{
  "success": true,
  "timestamp": "2025-03-15T07:00:00.000Z",
  "checkDate": "2025-03-15",
  "totalChecked": 5,
  "updated": 3,
  "errors": 0,
  "details": {
    "updated": [
      {
        "invoiceId": "...",
        "unitCode": "80-510",
        "tenantName": "ผู้เช่า",
        "daysOverdue": 5,
        "dailyLateFee": 100,
        "previousLateFee": 400,
        "newLateFee": 500,
        "newTotalAmount": 12000
      }
    ]
  }
}
```

## การแก้ไขปัญหา

### 1. ค่าปรับไม่ถูกคำนวณ
- ตรวจสอบ `AUTO_LATE_FEE_ENABLED` ใน .env
- ตรวจสอบ `lateFeeStartDate` ในใบแจ้งหนี้
- ตรวจสอบสถานะใบแจ้งหนี้ (ต้องไม่ใช่ PAID)

### 2. วันที่ไม่ถูกต้อง
- ตรวจสอบ `dueDayOfMonth` ในสัญญาเช่า
- ตรวจสอบ timezone setting
- ตรวจสอบการคำนวณวันที่ในโค้ด

### 3. การรัน Task Manual
```bash
# ดู task ที่มี
npx nuxi task --list

# รัน task เฉพาะ
npx nuxi task calculate-late-fees
```

## ข้อควรระวัง

1. **การคำนวณวันที่**: ระบบใช้เวลาท้องถิ่น (Asia/Bangkok)
2. **การอัปเดตค่าปรับ**: ทำงานทุกวัน ค่าปรับจะเพิ่มขึ้นเรื่อยๆ จนกว่าจะชำระ
3. **การยกเลิกสัญญา**: ระบบจะแสดงวันที่ยกเลิก แต่ไม่ได้ยกเลิกอัตโนมัติ
4. **การชำระบางส่วน**: หากชำระบางส่วน ค่าปรับจะยังคงคำนวณจากยอดคงเหลือ