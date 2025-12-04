# Free SSL Setup Guide 🆓

## Method 1: Railway (Easiest) ⭐
```bash
# 1. Deploy to Railway
git push origin main

# 2. Automatic HTTPS
https://your-app.railway.app ✅

# 3. Custom Domain (Optional)
# Add domain in Railway dashboard
# Update DNS records
# Free SSL auto-generated ✅
```

## Method 2: Cloudflare (Recommended) 🌟
```bash
# 1. Sign up Cloudflare (Free)
# 2. Add your domain
# 3. Change nameservers
# 4. Enable SSL/TLS → Full
# 5. Deploy anywhere with HTTP
# 6. Cloudflare handles HTTPS ✅
```

## Method 3: Let's Encrypt + Caddy 🔧
```dockerfile
# Dockerfile with Caddy
FROM caddy:alpine
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80 443
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
```

```caddyfile
# Caddyfile
yourdomain.com {
    reverse_proxy app:3000
    tls {
        email your@email.com
    }
}
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  caddy:
    image: caddy:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - app
  
  app:
    build: .
    expose:
      - "3000"

volumes:
  caddy_data:
  caddy_config:
```

## Method 4: Nginx + Certbot 🛠️
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Quick Comparison 📊

| Method | Difficulty | Cost | Auto-Renewal |
|--------|------------|------|--------------|
| Railway | ⭐ Easy | Free | ✅ Yes |
| Cloudflare | ⭐⭐ Easy | Free | ✅ Yes |
| Caddy | ⭐⭐⭐ Medium | Free | ✅ Yes |
| Certbot | ⭐⭐⭐⭐ Hard | Free | ⚠️ Manual |

## Recommended Setup 🎯

### For Beginners:
```bash
# Use Railway
railway login
railway link
railway up
# Done! HTTPS automatic ✅
```

### For Custom Domain:
```bash
# Use Cloudflare + Railway
# 1. Deploy on Railway (HTTP)
# 2. Point domain to Railway
# 3. Enable Cloudflare SSL
# Free SSL + CDN + DDoS protection ✅
```

### Environment Variables:
```env
# Railway
NUXT_APP_BASE_URL=https://your-app.railway.app

# Custom Domain
NUXT_APP_BASE_URL=https://yourdomain.com
LINE_WEBHOOK_URL=https://yourdomain.com/api/line/webhook
```

## 💡 Pro Tips:
- **Railway**: Zero config, instant SSL
- **Cloudflare**: Best performance + security
- **Caddy**: Best for self-hosting
- **Certbot**: Most control, most work

**Recommendation**: Start with Railway, upgrade to Cloudflare if needed!