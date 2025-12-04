# Deployment Guide

## Production Deployment Checklist

### 1. Environment Variables

Set all required environment variables in production:

```bash
DATABASE_URL="mysql://root:dezpax69@127.0.0.1:3006/condo_rent"
NUXT_APP_BASE_URL="https://localhost:3000"
LINE_CHANNEL_ACCESS_TOKEN="your_production_token"
LINE_CHANNEL_SECRET="your_production_secret"
LINE_WEBHOOK_URL="https://yourdomain.com/api/line/webhook"
SESSION_SECRET="generate_a_secure_random_string_min_32_chars"
NODE_ENV="production"
```

### 2. Database Setup

```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Optional: Seed initial data
npx prisma db seed
```

### 3. Build Application

```bash
npm install
npm run build
```

### 4. LINE Messaging API Configuration

1. Go to [LINE Developers Console](https://developers.line.biz/)
2. Create a Messaging API channel
3. Get Channel Access Token and Channel Secret
4. Set Webhook URL: `https://yourdomain.com/api/line/webhook`
5. Enable webhook
6. Disable auto-reply messages (optional)

### 5. Scheduled Tasks Setup

#### Option A: Using Cron Jobs

Add to your crontab:

```bash
# Generate monthly invoices on 1st of each month at 00:00
0 0 1 * * cd /path/to/app && npx nuxi task monthly-invoice-generation

# Send LINE reminders daily at 09:00
0 9 * * * cd /path/to/app && npx nuxi task line-reminders
```

#### Option B: Using Nitro Scheduled Tasks

Configure in `nuxt.config.ts`:

```typescript
nitro: {
  scheduledTasks: {
    '0 0 1 * *': ['monthly-invoice-generation'],
    '0 9 * * *': ['line-reminders']
  }
}
```

### 6. Security Considerations

- [ ] Use HTTPS in production
- [ ] Set secure session secret (min 32 characters)
- [ ] Enable CORS only for trusted domains
- [ ] Use environment variables for all secrets
- [ ] Implement rate limiting on API endpoints
- [ ] Regular database backups
- [ ] Monitor LINE API usage and quotas

### 7. Performance Optimization

- [ ] Enable database connection pooling
- [ ] Add indexes to frequently queried fields
- [ ] Implement caching for dashboard statistics
- [ ] Use CDN for static assets
- [ ] Enable gzip compression

### 8. Monitoring

Set up monitoring for:
- Application errors and crashes
- Database connection issues
- LINE API failures
- Scheduled task execution
- Server resource usage

### 9. Backup Strategy

- Daily database backups
- Store backups in secure location
- Test restore procedures regularly
- Keep backups for at least 30 days

### 10. Post-Deployment

1. Test login functionality
2. Create test property, unit, tenant, and lease
3. Generate test invoice
4. Send test LINE message
5. Verify webhook is receiving LINE events
6. Check scheduled tasks are running

## Troubleshooting

### LINE Messages Not Sending

1. Check `LINE_CHANNEL_ACCESS_TOKEN` is correct
2. Verify tenant has valid `lineUserId`
3. Check LINE API quota limits
4. Review `LineMessageLog` table for error messages

### Webhook Not Working

1. Verify webhook URL is publicly accessible
2. Check `LINE_CHANNEL_SECRET` is correct
3. Ensure HTTPS is enabled
4. Review webhook logs in LINE Developers Console

### Database Connection Issues

1. Verify `DATABASE_URL` format
2. Check database server is accessible
3. Ensure database user has proper permissions
4. Review connection pool settings

## Scaling Considerations

For high-volume deployments:

1. Use PostgreSQL with read replicas
2. Implement Redis for session storage
3. Use message queue (e.g., Bull) for LINE notifications
4. Deploy multiple application instances with load balancer
5. Separate scheduled tasks to dedicated worker instances

## Support

For issues or questions, refer to:
- Nuxt documentation: https://nuxt.com
- Prisma documentation: https://www.prisma.io
- LINE Messaging API: https://developers.line.biz/en/docs/messaging-api/
