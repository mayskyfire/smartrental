# Docker + Railway Deployment Guide

## 🐳 Docker Setup

### Build & Run Locally

```bash
# Build Docker image
docker build -t condo-rent .

# Run container
docker run -p 3000:3000 --env-file .env condo-rent
```

### Docker Compose (Optional)

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - SESSION_SECRET=${SESSION_SECRET}
      - LINE_CHANNEL_ACCESS_TOKEN=${LINE_CHANNEL_ACCESS_TOKEN}
    depends_on:
      - db
  
  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: condo_rent
    ports:
      - "3306:3306"
```

## 🚀 Railway Deployment

### Method 1: Dockerfile (Recommended)

Railway will automatically detect `Dockerfile` and use it for deployment.

1. **Push to GitHub** with Dockerfile
2. **Connect Repository** in Railway
3. **Set Environment Variables**:
   ```env
   DATABASE_URL=mysql://user:pass@host:port/db
   SESSION_SECRET=your_32_char_secret
   LINE_CHANNEL_ACCESS_TOKEN=your_token
   LINE_CHANNEL_SECRET=your_secret
   LINE_WEBHOOK_URL=https://your-app.railway.app/api/line/webhook
   ```

### Method 2: Railway Config

Use `railway.toml` to force Dockerfile usage:

```toml
[build]
builder = "dockerfile"

[deploy]
startCommand = "npm start"
```

## 📁 Files Added

- `Dockerfile` - Multi-stage Docker build
- `.dockerignore` - Exclude unnecessary files
- `railway.toml` - Railway configuration
- `docker-compose.yml` - Local development (optional)

## 🔧 Configuration

### Environment Variables (Railway)
```env
DATABASE_URL=mysql://username:password@host:port/database
SESSION_SECRET=your_random_32_character_secret_key
LINE_CHANNEL_ACCESS_TOKEN=your_line_token
LINE_CHANNEL_SECRET=your_line_secret
LINE_WEBHOOK_URL=https://your-app.railway.app/api/line/webhook
NUXT_APP_BASE_URL=https://your-app.railway.app
PORT=3000
```

### Docker Features
- ✅ Node.js 22 Alpine (lightweight)
- ✅ Multi-stage build optimization
- ✅ Production dependencies only
- ✅ Prisma client generation
- ✅ Automatic port detection

## 🐛 Troubleshooting

**Build fails:**
- Check Dockerfile syntax
- Verify all files are copied correctly

**Container won't start:**
- Check environment variables
- Verify DATABASE_URL connection

**Railway deployment issues:**
- Ensure Dockerfile is in root directory
- Check Railway build logs

## 💡 Benefits

- **Consistent Environment** - Same runtime everywhere
- **Easy Scaling** - Railway auto-scaling
- **Isolation** - Containerized dependencies
- **Fast Deployment** - Docker layer caching