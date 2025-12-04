# Caddy Auto HTTPS Setup 🚀

## ✨ Features
- 🔒 **Auto SSL** - Let's Encrypt certificates
- 🔄 **Auto Renewal** - Never expires
- 🛡️ **Security Headers** - Built-in protection
- 📊 **Logging** - Access logs
- 🗜️ **Compression** - Gzip enabled

## 🚀 Quick Start

### 1. Update Domain
Edit `Caddyfile`:
```caddyfile
# Change this line
yourdomain.com {
    # to your actual domain
    mydomain.com {
```

### 2. Update Email
```caddyfile
tls {
    email admin@mydomain.com  # Your email
}
```

### 3. Update Environment
Edit `docker-compose.ssl.yml`:
```yaml
environment:
  - NUXT_APP_BASE_URL=https://mydomain.com
  - LINE_WEBHOOK_URL=https://mydomain.com/api/line/webhook
```

### 4. Deploy
```bash
# Start with SSL
docker-compose -f docker-compose.ssl.yml up -d

# Check logs
docker-compose -f docker-compose.ssl.yml logs caddy
```

## 🔧 Configuration

### Caddyfile Features:
```caddyfile
mydomain.com {
    # Reverse proxy to app
    reverse_proxy app:3000
    
    # Auto HTTPS (Let's Encrypt)
    tls {
        email admin@mydomain.com
    }
    
    # Security headers
    header {
        Strict-Transport-Security "max-age=31536000"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
    }
    
    # Gzip compression
    encode gzip
    
    # Access logging
    log {
        output file /var/log/caddy/access.log
    }
}
```

## 🌐 DNS Setup

Point your domain to server:
```
A    mydomain.com      → YOUR_SERVER_IP
A    www.mydomain.com  → YOUR_SERVER_IP
```

## 📋 Commands

```bash
# Start services
docker-compose -f docker-compose.ssl.yml up -d

# View logs
docker-compose -f docker-compose.ssl.yml logs -f

# Stop services
docker-compose -f docker-compose.ssl.yml down

# Restart Caddy only
docker-compose -f docker-compose.ssl.yml restart caddy

# Check certificate
curl -I https://yourdomain.com
```

## 🔍 Troubleshooting

### Certificate Issues:
```bash
# Check Caddy logs
docker-compose -f docker-compose.ssl.yml logs caddy

# Common issues:
# 1. Domain not pointing to server
# 2. Port 80/443 blocked
# 3. Invalid email address
```

### DNS Verification:
```bash
# Check DNS
nslookup yourdomain.com

# Check ports
telnet yourdomain.com 80
telnet yourdomain.com 443
```

## 🎯 Production Checklist

- ✅ Domain points to server IP
- ✅ Ports 80 & 443 open
- ✅ Valid email in Caddyfile
- ✅ Environment variables set
- ✅ Firewall allows HTTP/HTTPS

## 🔄 Auto Renewal

Caddy automatically:
- ✅ Requests certificates
- ✅ Renews before expiry
- ✅ Handles ACME challenges
- ✅ Zero downtime renewal

## 📊 Monitoring

```bash
# Check certificate expiry
echo | openssl s_client -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates

# View access logs
docker exec -it caddy tail -f /var/log/caddy/access.log
```

## 💡 Benefits

- **Zero Config SSL** - Just add domain
- **Auto Renewal** - Never expires
- **Security** - Built-in headers
- **Performance** - Gzip compression
- **Monitoring** - Access logs
- **Free** - Let's Encrypt certificates

**Result**: Production-ready HTTPS in minutes! 🎉