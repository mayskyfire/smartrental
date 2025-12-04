# คู่มือการตั้งค่าระบบ

## การแก้ไขการตั้งค่า LINE Messaging API

ระบบรองรับการแก้ไขการตั้งค่า LINE ผ่านหน้า Settings โดยเก็บค่าในฐานข้อมูล

### วิธีการตั้งค่า

1. เข้าหน้า **Settings** ในระบบ
2. กรอกข้อมูล LINE Messaging API:
   - **Channel Access Token**: Token จาก LINE Developers Console
   - **Channel Secret**: Secret จาก LINE Developers Console
   - **เปิดใช้งานการแจ้งเตือนอัตโนมัติ**: เลือก checkbox เพื่อเปิด/ปิด
   - **Cron Schedule**: กำหนดเวลาส่งแจ้งเตือน (เช่น "0 9 * * *" = ทุกวัน 09:00)
3. กดปุ่ม **บันทึกการตั้งค่า**

### การทำงาน

- ค่าที่บันทึกจะถูกเก็บในตาราง `SystemSetting` ในฐานข้อมูล
- ระบบจะใช้ค่าจากฐานข้อมูลเป็นหลัก
- หากไม่มีค่าในฐานข้อมูล จะใช้ค่าจาก `.env` แทน
- ไม่จำเป็นต้อง restart server หลังแก้ไข

### Migration

หลังจาก pull code ใหม่ ให้รัน:

```bash
npx prisma migrate dev
npx prisma generate
```

### API Endpoints

- `GET /api/settings` - ดึงการตั้งค่าปัจจุบัน
- `PATCH /api/settings` - อัปเดตการตั้งค่า

### ตัวอย่าง Request

```bash
PATCH /api/settings
{
  "lineChannelAccessToken": "your_token",
  "lineChannelSecret": "your_secret",
  "autoLineReminderEnabled": true,
  "autoLineReminderCron": "0 9 * * *"
}
```

### หมายเหตุ

- การตั้งค่าจะมีผลทันทีหลังบันทึก
- Webhook URL จะถูกสร้างอัตโนมัติจาก `NUXT_APP_BASE_URL`
- ควรเก็บ Token และ Secret อย่างปลอดภัย
