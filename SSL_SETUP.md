# SSL/HTTPS Setup Guide

## 🔒 SSL Configuration Options

### Option 1: Railway Auto-SSL (Recommended)
Railway provides automatic HTTPS for all deployments:
- ✅ **Automatic SSL certificates**
- ✅ **Custom domain support**
- ✅ **No configuration needed**
- ✅ **Free SSL certificates**

Simply deploy to Railway and access via:
- `https://your-app.railway.app`
- `https://your-custom-domain.com` (after domain setup)

### Option 2: Custom SSL Certificates
For custom SSL certificates, set environment variables:

```env
SSL_CERT_PATH=/path/to/certificate.crt
SSL_KEY_PATH=/path/to/private.key
```

### Option 3: Reverse Proxy (Production)
Use Nginx/Caddy for SSL termination:

#### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Caddy Configuration
```
yourdomain.com {
    reverse_proxy localhost:3000
}
```

## 🚀 Railway SSL Setup

### Automatic HTTPS
1. Deploy to Railway
2. App automatically gets HTTPS at `*.railway.app`
3. No configuration needed!

### Custom Domain
1. Go to Railway dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as shown
4. SSL certificate auto-generated

### Environment Variables
```env
NUXT_APP_BASE_URL=https://your-app.railway.app
LINE_WEBHOOK_URL=https://your-app.railway.app/api/line/webhook
```

## 🐳 Docker SSL

### Development with Self-Signed Certificate
```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Run with SSL
docker run -p 443:443 -e SSL_CERT_PATH=/app/cert.pem -e SSL_KEY_PATH=/app/key.pem condo-rent
```

### Production with Let's Encrypt
```bash
# Using Certbot
certbot certonly --standalone -d yourdomain.com

# Mount certificates
docker run -p 443:443 \
  -v /etc/letsencrypt/live/yourdomain.com:/certs \
  -e SSL_CERT_PATH=/certs/fullchain.pem \
  -e SSL_KEY_PATH=/certs/privkey.pem \
  condo-rent
```

## 🔧 Configuration Files Updated

- `nuxt.config.ts` - Added HTTPS support
- `Dockerfile` - Exposed port 443
- `.env.example` - Added SSL variables

## 🛡️ Security Features

- ✅ **HTTPS Redirect** - Automatic HTTP to HTTPS
- ✅ **Secure Headers** - Security headers included
- ✅ **SSL Termination** - Multiple SSL options
- ✅ **Certificate Management** - Auto-renewal support

## 📝 Notes

- **Railway**: HTTPS is automatic and free
- **Custom SSL**: Only needed for specific requirements
- **Development**: Use Railway's auto-SSL for simplicity
- **Production**: Railway handles SSL certificates automatically

**Recommended**: Use Railway's automatic HTTPS for the easiest setup!