# System Architecture

## Overview

Multi-Property Monthly Rental Management & LINE Auto Notification System built with Nuxt 4 full-stack architecture.

## Technology Stack

- **Frontend**: Nuxt 4, Vue 3, TypeScript, Tailwind CSS
- **Backend**: Nuxt Server Routes (Nitro)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Session-based with HTTP-only cookies
- **External API**: LINE Messaging API
- **Scheduled Tasks**: Nitro Tasks / Cron Jobs

## Project Structure

```
condo_rent/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Sample data
├── server/
│   ├── api/                   # API endpoints
│   │   ├── auth/              # Login, logout, me
│   │   ├── properties/        # Property CRUD
│   │   ├── units/             # Unit CRUD
│   │   ├── tenants/           # Tenant CRUD
│   │   ├── leases/            # Lease CRUD
│   │   ├── invoices/          # Invoice management
│   │   │   ├── generate-monthly.post.ts
│   │   │   └── [id]/payments.post.ts
│   │   └── line/              # LINE integration
│   │       ├── send-reminder.post.ts
│   │       ├── send-monthly-batch.post.ts
│   │       ├── send-manual.post.ts
│   │       ├── webhook.post.ts
│   │       └── logs.get.ts
│   ├── services/              # Business logic
│   │   └── line.service.ts    # LINE API wrapper
│   ├── utils/                 # Utilities
│   │   ├── prisma.ts          # Prisma client
│   │   └── session.ts         # Session management
│   └── tasks/                 # Scheduled tasks
│       ├── monthly-invoice.ts
│       └── line-reminders.ts
├── pages/                     # Frontend pages
│   ├── login.vue
│   ├── dashboard.vue
│   ├── properties.vue
│   ├── units.vue
│   ├── tenants.vue
│   ├── leases.vue
│   ├── invoices.vue
│   ├── line.vue
│   └── settings.vue
├── layouts/
│   └── default.vue            # Main layout with sidebar
└── components/                # Reusable components
```

## Data Model

### Core Entities

1. **User** - System users (admin, staff, viewer)
2. **Property** - Condo projects/buildings
3. **Unit** - Individual rental units
4. **Tenant** - Renters
5. **Lease** - Rental contracts
6. **Invoice** - Monthly rental invoices
7. **Payment** - Payment records
8. **LineMessageLog** - LINE notification history

### Key Relationships

- Property → Units (1:N)
- Unit → Leases (1:N)
- Tenant → Leases (1:N)
- Lease → Invoices (1:N)
- Invoice → Payments (1:N)
- Tenant → LineMessageLog (1:N)

## Core Features

### 1. Multi-Property Management

- Support multiple condo projects
- Filter all views by property
- Property-level reporting

### 2. Monthly Invoice Generation

**Automatic Process:**
1. Scheduled task runs on 1st of each month
2. Finds all ACTIVE leases
3. Creates invoice for each lease
4. Calculates billing period and due date
5. Prevents duplicate invoices (unique constraint)

**Manual Process:**
- Admin can trigger generation via UI
- Specify year and month
- Generates for all or specific property

### 3. Payment Recording

- Record full or partial payments
- Multiple payment methods
- Auto-update invoice status:
  - PENDING → PARTIALLY_PAID → PAID
- Track payment history per invoice

### 4. LINE Notifications

**Automatic Reminders:**
- 3 days before due date
- On due date
- 1, 3, 7 days after due date (overdue)

**Manual Sending:**
- Send to specific invoices
- Batch send for month/property
- Custom messages to tenants

**Interactive Features:**
- Tenants can check balance via LINE chat
- Commands: "ยอดค้างชำระ", "ตรวจสอบยอด"
- Auto-reply with outstanding amounts

### 5. Dashboard & Reporting

**KPIs:**
- Active tenants count
- Vacant units count
- Outstanding amount
- Overdue invoices count

**Filters:**
- By property
- By date range
- By status

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties` - List all
- `POST /api/properties` - Create
- `PATCH /api/properties/:id` - Update

### Units
- `GET /api/units?propertyId=` - List with filter
- `POST /api/units` - Create

### Tenants
- `GET /api/tenants` - List all
- `POST /api/tenants` - Create

### Leases
- `GET /api/leases?propertyId=` - List with filter
- `POST /api/leases` - Create

### Invoices
- `GET /api/invoices?propertyId=&year=&month=&status=` - List with filters
- `GET /api/invoices/:id` - Get details
- `POST /api/invoices/generate-monthly` - Generate for month
- `POST /api/invoices/:id/payments` - Record payment

### LINE
- `POST /api/line/send-reminder` - Send to specific invoices
- `POST /api/line/send-monthly-batch` - Batch send
- `POST /api/line/send-manual` - Custom message
- `POST /api/line/webhook` - LINE webhook handler
- `GET /api/line/logs` - Message history

## Security

### Authentication
- Session-based with HTTP-only cookies
- 7-day session expiration
- Password hashing with bcrypt

### Authorization
- All API endpoints require authentication (except login/webhook)
- Role-based access control (ADMIN, STAFF, VIEWER)

### LINE Webhook Security
- Signature verification using HMAC-SHA256
- Validates X-Line-Signature header

## Scheduled Tasks

### Monthly Invoice Generation
- **Schedule**: 1st of each month at 00:00
- **Action**: Generate invoices for all ACTIVE leases
- **Idempotent**: Skips existing invoices

### LINE Reminders
- **Schedule**: Daily at 09:00
- **Action**: Send reminders based on due dates
- **Logic**:
  - 3 days before: "ก่อนถึงกำหนด"
  - On due date: "วันครบกำหนด"
  - After due: "เกินกำหนด"

## Performance Considerations

### Database
- Indexes on foreign keys
- Unique constraints prevent duplicates
- Cascade deletes for data integrity

### Caching
- Prisma client singleton
- Session storage in memory (consider Redis for production)

### Scalability
- Stateless API design
- Can deploy multiple instances
- Database connection pooling

## Error Handling

### API Errors
- Consistent error responses
- HTTP status codes
- Error messages in Thai

### LINE API Failures
- Logged in LineMessageLog
- Stored in invoice.lineLastError
- Retry mechanism can be added

## Future Enhancements

### High Priority
- [ ] Payment receipt generation (PDF)
- [ ] Email notifications as backup
- [ ] Expense tracking per property
- [ ] Maintenance request system

### Medium Priority
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced reporting and analytics
- [ ] Document storage (contracts, IDs)

### Low Priority
- [ ] Tenant portal
- [ ] Online payment integration
- [ ] SMS notifications
- [ ] Accounting system integration

## Testing Strategy

### Unit Tests
- Service layer functions
- Utility functions
- Business logic

### Integration Tests
- API endpoints
- Database operations
- LINE API integration

### E2E Tests
- Critical user flows
- Invoice generation
- Payment recording
- LINE notifications

## Monitoring & Logging

### Application Logs
- API requests/responses
- Scheduled task execution
- LINE API calls

### Metrics
- Invoice generation success rate
- LINE notification delivery rate
- Payment recording frequency
- API response times

### Alerts
- Failed scheduled tasks
- LINE API errors
- Database connection issues
- High error rates
