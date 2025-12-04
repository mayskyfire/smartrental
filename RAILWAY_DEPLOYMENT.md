# Railway Deployment Guide

## 🚀 Deploy to Railway

### Prerequisites
- Railway account (https://railway.app)
- GitHub repository

### Step 1: Prepare Database
1. Create MySQL database on Railway:
   - Go to Railway dashboard
   - Click "New Project" → "Provision MySQL"
   - Copy the DATABASE_URL from Variables tab

### Step 2: Deploy Application
1. Connect GitHub repository:
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect and deploy

### Step 3: Configure Environment Variables
Add these variables in Railway dashboard → Variables:

```env
DATABASE_URL=mysql://username:password@host:port/database
SESSION_SECRET=your_32_character_random_secret_key
LINE_CHANNEL_ACCESS_TOKEN=your_line_token
LINE_CHANNEL_SECRET=your_line_secret
LINE_WEBHOOK_URL=https://your-app.railway.app/api/line/webhook
NUXT_APP_BASE_URL=https://your-app.railway.app
AUTO_INVOICE_ENABLED=true
AUTO_INVOICE_CRON=0 0 1 * *
AUTO_OVERDUE_CHECK_ENABLED=true
AUTO_OVERDUE_CHECK_CRON=0 6 * * *
AUTO_LATE_FEE_ENABLED=true
AUTO_LATE_FEE_CRON=0 7 * * *
AUTO_LINE_REMINDER_ENABLED=true
AUTO_LINE_REMINDER_CRON=0 9 * * *
TIMEZONE=Asia/Bangkok
```

### Step 4: Run Database Migration
1. Go to Railway dashboard → your service
2. Click "Deploy" tab → "View Logs"
3. Wait for deployment to complete
4. The app will auto-run `prisma generate` during build

### Step 5: Seed Database (Optional)
If you want sample data:
1. Connect to your Railway service terminal
2. Run: `npx prisma db seed`

### Step 6: Configure LINE Webhook
1. Update LINE webhook URL to: `https://your-app.railway.app/api/line/webhook`
2. Test the webhook in LINE Developer Console

## 🔧 Railway Configuration Files

- `railway.json` - Railway deployment config
- `nixpacks.toml` - Build configuration
- Updated `package.json` scripts

## 📝 Notes

- Railway automatically detects Node.js and runs build
- Database migrations run during build process
- Environment variables are managed through Railway dashboard
- Custom domain can be configured in Railway settings
- Automatic HTTPS is provided by Railway

## 🐛 Troubleshooting

**Build fails:**
- Check build logs in Railway dashboard
- Verify all environment variables are set

**Database connection error:**
- Verify DATABASE_URL is correct
- Ensure MySQL service is running

**App not accessible:**
- Check if deployment completed successfully
- Verify domain configuration

## 💰 Pricing

Railway offers:
- Free tier with usage limits
- Pay-as-you-go pricing
- No credit card required for free tier

Perfect for development and small production deployments!