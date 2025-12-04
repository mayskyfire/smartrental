# Multi-Property Monthly Rental Management & LINE Auto Notification System

## Project Overview

A complete full-stack web application built with **Nuxt 4 + TypeScript** for managing multiple condo properties, rental units, tenants, lease contracts, and automated monthly billing with LINE notification integration.

## Key Features

✅ **Multi-Property Management** - Manage multiple condo buildings/projects  
✅ **Unit & Tenant Management** - Track rental units and tenant information  
✅ **Lease Contract System** - Create and manage rental agreements  
✅ **Automatic Monthly Invoice Generation** - Auto-create invoices for all active leases  
✅ **Payment Recording** - Track full/partial payments with multiple methods  
✅ **LINE Auto Notifications** - Automated reminders via LINE Messaging API  
✅ **Interactive LINE Chat** - Tenants can check balance via LINE  
✅ **Thai Language UI** - Complete Thai interface for landlords  
✅ **Dashboard & Reporting** - KPIs and filtering by property  
✅ **Role-Based Access** - Admin, Staff, Viewer roles  

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Nuxt 4 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | Session-based (bcrypt) |
| External API | LINE Messaging API |
| Scheduled Tasks | Nitro Tasks |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your database and LINE credentials

# 3. Setup database
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# 4. Run development server
npm run dev
```

Visit `http://localhost:3000` and login with:
- Email: `admin@example.com`
- Password: `admin123`

## Project Structure

```
condo_rent/
├── prisma/
│   ├── schema.prisma          # 8 models: User, Property, Unit, Tenant, Lease, Invoice, Payment, LineMessageLog
│   └── seed.ts                # Sample data with 2 properties, 3 units, 2 tenants, 2 leases
│
├── server/
│   ├── api/
│   │   ├── auth/              # Login, logout, me endpoints
│   │   ├── properties/        # Property CRUD
│   │   ├── units/             # Unit CRUD with property filter
│   │   ├── tenants/           # Tenant CRUD
│   │   ├── leases/            # Lease CRUD with property filter
│   │   ├── invoices/          # Invoice management + generate-monthly
│   │   └── line/              # LINE integration (send, webhook, logs)
│   ├── services/
│   │   └── line.service.ts    # LINE API wrapper functions
│   ├── utils/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   └── session.ts         # Session management
│   └── tasks/
│       ├── monthly-invoice.ts # Auto-generate invoices (1st of month)
│       └── line-reminders.ts  # Auto-send reminders (daily)
│
├── pages/
│   ├── login.vue              # Login page
│   ├── dashboard.vue          # KPIs + upcoming invoices
│   ├── properties.vue         # Property management
│   ├── units.vue              # Unit management
│   ├── tenants.vue            # Tenant management
│   ├── leases.vue             # Lease management
│   ├── invoices.vue           # Invoice list + payment recording
│   ├── line.vue               # LINE message history + manual send
│   └── settings.vue           # System settings
│
└── layouts/
    └── default.vue            # Main layout with Thai sidebar navigation
```

## Database Schema

### 8 Core Models

1. **User** - System users with roles (ADMIN, STAFF, VIEWER)
2. **Property** - Condo projects (name, code, address)
3. **Unit** - Rental units (unitCode, floor, baseRentAmount, status)
4. **Tenant** - Renters (fullName, phone, email, lineUserId)
5. **Lease** - Contracts (monthlyRentAmount, dueDayOfMonth, status)
6. **Invoice** - Monthly bills (billingYear/Month, dueDate, totalAmount, paidAmount, status)
7. **Payment** - Payment records (amount, paidDate, method)
8. **LineMessageLog** - Notification history (type, messageContent, status)

### Key Relationships

- Property → Units (1:N)
- Unit → Leases (1:N)
- Tenant → Leases (1:N)
- Lease → Invoices (1:N)
- Invoice → Payments (1:N)

### Unique Constraints

- `Invoice`: (leaseId, billingYear, billingMonth) - Prevents duplicate monthly invoices
- `Unit`: (propertyId, unitCode) - Unique unit codes per property

## Core Workflows

### 1. Monthly Invoice Generation

**Automatic (Scheduled Task):**
```
1st of each month at 00:00
→ Find all ACTIVE leases
→ For each lease:
  - Check if invoice exists for (leaseId, year, month)
  - If not, create invoice with:
    * billingPeriodStart/End (full month)
    * dueDate (based on lease.dueDayOfMonth)
    * totalAmount (from lease.monthlyRentAmount)
    * Denormalized propertyId, unitId for filtering
```

**Manual:**
```
Admin clicks "สร้างใบแจ้งหนี้เดือนนี้"
→ POST /api/invoices/generate-monthly
→ Same logic as automatic
```

### 2. Payment Recording

```
Admin clicks "บันทึกชำระ" on invoice
→ Enter amount, date, method, note
→ POST /api/invoices/:id/payments
→ Create Payment record
→ Update invoice.paidAmount
→ Update invoice.status:
  - paidAmount >= totalAmount → PAID
  - paidAmount > 0 → PARTIALLY_PAID
  - paidAmount = 0 → PENDING
```

### 3. LINE Notifications

**Automatic Reminders (Scheduled Task):**
```
Daily at 09:00
→ Find invoices with status PENDING/PARTIALLY_PAID where:
  - dueDate is 3 days away → Send "ก่อนถึงกำหนด"
  - dueDate is today → Send "วันครบกำหนด"
  - dueDate was 1/3/7 days ago → Send "เกินกำหนด"
→ For each invoice:
  - Format Thai message with property, unit, amount, due date
  - Send via LINE Messaging API
  - Log in LineMessageLog
  - Update invoice.lineNotificationStatus
```

**Manual Send:**
```
Admin clicks "ส่ง LINE" on invoice
→ POST /api/line/send-reminder
→ Send immediately to tenant
```

**Batch Send:**
```
Admin clicks "ส่งแจ้งเตือน LINE ทั้งหมด"
→ POST /api/line/send-monthly-batch
→ Send to all PENDING/PARTIALLY_PAID invoices for selected month/property
```

### 4. Interactive LINE Chat

**Tenant sends message:**
```
Tenant: "ยอดค้างชำระ" or "ตรวจสอบยอด"
→ LINE webhook receives event
→ POST /api/line/webhook
→ Verify signature
→ Find tenant by lineUserId
→ Query all PENDING/PARTIALLY_PAID/OVERDUE invoices
→ Calculate total outstanding
→ Reply with formatted Thai message:
  "คุณมียอดค่าเช่าค้างชำระทั้งหมด X บาท
   - ห้อง A-1203 โครงการ X: เดือน 03/2025 จำนวน 8,000 บาท
   - ห้อง B-708 โครงการ Y: เดือน 03/2025 จำนวน 4,000 บาท"
```

## API Endpoints Summary

### Authentication
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout and clear session
- `GET /api/auth/me` - Get current user info

### Properties
- `GET /api/properties` - List all properties with unit count
- `POST /api/properties` - Create new property
- `PATCH /api/properties/:id` - Update property

### Units
- `GET /api/units?propertyId=` - List units (filterable by property)
- `POST /api/units` - Create new unit

### Tenants
- `GET /api/tenants` - List all tenants with active leases
- `POST /api/tenants` - Create new tenant

### Leases
- `GET /api/leases?propertyId=` - List leases (filterable by property)
- `POST /api/leases` - Create new lease (auto-updates unit status to OCCUPIED)

### Invoices
- `GET /api/invoices?propertyId=&year=&month=&status=` - List with filters
- `GET /api/invoices/:id` - Get invoice details with payments
- `POST /api/invoices/generate-monthly` - Generate invoices for month
- `POST /api/invoices/:id/payments` - Record payment

### LINE
- `POST /api/line/send-reminder` - Send to specific invoice IDs
- `POST /api/line/send-monthly-batch` - Batch send for month/property
- `POST /api/line/send-manual` - Send custom message to tenant
- `POST /api/line/webhook` - LINE webhook handler (signature verified)
- `GET /api/line/logs` - Get message history (last 50)

## Frontend Pages

### 1. Dashboard (`/dashboard`)
- KPI cards: Active tenants, vacant units, outstanding amount, overdue invoices
- Filter by property dropdown
- Table: Top 10 upcoming invoices with due dates

### 2. Properties (`/properties`)
- Table: Property name, code, address, unit count
- Modal: Add new property form

### 3. Units (`/units`)
- Filter by property
- Table: Property, unit code, floor, base rent, status, current tenant
- Modal: Add new unit form

### 4. Tenants (`/tenants`)
- Table: Name, phone, email, current units, LINE connection status
- Modal: Add new tenant form (with lineUserId field)

### 5. Leases (`/leases`)
- Table: Tenant, property, unit, monthly rent, start date, due day, status
- Modal: Create lease form (select property → unit → tenant)

### 6. Invoices (`/invoices`)
- Filters: Property, year, month, status
- Table: Tenant, property, unit, month/year, due date, amounts, status
- Actions per row: "บันทึกชำระ", "ส่ง LINE"
- Toolbar buttons:
  - "สร้างใบแจ้งหนี้เดือนนี้" - Generate for current month
  - "ส่งแจ้งเตือน LINE ทั้งหมด" - Batch send
- Payment modal: Amount, date, method, note

### 7. LINE Notifications (`/line`)
- Manual send section: Select tenant, enter message, send
- Message history table: Date, tenant, type, message, status

### 8. Settings (`/settings`)
- LINE API configuration (read-only, set via .env)
- Webhook URL display
- Notification schedule settings (informational)
- Auto-invoice generation toggle (informational)

## LINE Messaging API Integration

### Setup Requirements

1. Create LINE Messaging API channel at https://developers.line.biz/
2. Get Channel Access Token and Channel Secret
3. Set webhook URL: `https://yourdomain.com/api/line/webhook`
4. Enable webhook, disable auto-reply

### Message Format

**Monthly Reminder:**
```
🏢 แจ้งเตือนค่าเช่า

คุณสมชาย ใจดี
โครงการ: คอนโด A พระราม 9
ห้อง: A-1203

เดือน: มี.ค. 2568
วันครบกำหนด: 5 มีนาคม 2568

ยอดค่าเช่า: 8,000 บาท
ชำระแล้ว: 0 บาท
คงค้าง: 8,000 บาท

กรุณาชำระภายในวันครบกำหนด ขอบคุณค่ะ
```

### Webhook Security

- Validates `X-Line-Signature` header using HMAC-SHA256
- Compares with hash of request body using `LINE_CHANNEL_SECRET`
- Rejects invalid signatures with 401

## Scheduled Tasks

### Monthly Invoice Generation
- **Trigger**: 1st of each month at 00:00
- **Command**: `npx nuxi task monthly-invoice-generation`
- **Cron**: `0 0 1 * *`

### LINE Reminders
- **Trigger**: Daily at 09:00
- **Command**: `npx nuxi task line-reminders`
- **Cron**: `0 9 * * *`

## Security Features

✅ Password hashing with bcrypt  
✅ HTTP-only session cookies  
✅ 7-day session expiration  
✅ All APIs require authentication (except login/webhook)  
✅ LINE webhook signature verification  
✅ Role-based access control ready  
✅ No credentials in code (environment variables)  

## Production Deployment

See `DEPLOYMENT.md` for complete checklist including:
- Environment variable configuration
- Database migration steps
- LINE API setup
- Scheduled task configuration (cron or Nitro)
- Security hardening
- Monitoring setup

## Testing

### Manual Testing Checklist

1. ✅ Login with admin credentials
2. ✅ Create property
3. ✅ Create units for property
4. ✅ Create tenant with LINE user ID
5. ✅ Create lease (unit status → OCCUPIED)
6. ✅ Generate monthly invoices
7. ✅ Record payment (invoice status updates)
8. ✅ Send LINE reminder (check LineMessageLog)
9. ✅ Test LINE webhook (send "ยอดค้างชำระ" from LINE)
10. ✅ Filter dashboard by property

## Known Limitations & TODOs

### Current Limitations
- In-memory session storage (use Redis for production)
- No payment receipt generation
- No email notifications
- No file upload for documents
- No tenant portal

### Production TODOs
- [ ] Add rate limiting to API endpoints
- [ ] Implement Redis for session storage
- [ ] Add database connection pooling
- [ ] Set up error monitoring (Sentry)
- [ ] Add API request logging
- [ ] Implement backup strategy
- [ ] Add unit tests for critical functions
- [ ] Add E2E tests for main workflows
- [ ] Optimize database queries with indexes
- [ ] Add caching for dashboard statistics

### Feature Enhancements
- [ ] PDF invoice generation
- [ ] Email notifications as backup
- [ ] Expense tracking per property
- [ ] Maintenance request system
- [ ] Advanced reporting and analytics
- [ ] Multi-language support
- [ ] Mobile app
- [ ] Online payment integration

## Support & Documentation

- **README.md** - Setup and quick start guide
- **ARCHITECTURE.md** - Detailed system architecture
- **DEPLOYMENT.md** - Production deployment guide
- **PROJECT_SUMMARY.md** - This file

## License

MIT

---

**Built with ❤️ using Nuxt 4 + TypeScript**
