# 🎵 SongUp on YunoHost - Installation Guide

This guide walks you through installing SongUp on a YunoHost instance using Docker.

## 📋 Prerequisites

- YunoHost server (v11.0+)
- Domain configured in YunoHost
- SSH access to your server
- Docker & Docker Compose installed on the server

## 🚀 Installation Steps

### 1. SSH into Your Server

```bash
ssh root@your-server-ip
```

### 2. Create App Directory

```bash
mkdir -p /srv/songup
cd /srv/songup
```

### 3. Clone the Repository

```bash
git clone https://github.com/rcaneill/songup.git .
git checkout self-host
```

### 4. Configure Environment

```bash
cp .env.self-host .env
nano .env
```

Edit the following required variables:
```bash
DB_PASSWORD=YOUR_STRONG_PASSWORD_HERE
NEXT_PUBLIC_CONVEX_URL=https://your-domain.com/convex
FLASK_URL=http://flask:5328
```

### 5. Configure Nginx for YunoHost

```bash
# Copy Nginx config
cp nginx_yunohost.conf /etc/nginx/sites-available/songup

# Edit domain in config
sed -i 's/__DOMAIN__/your-domain.com/g' /etc/nginx/sites-available/songup

# Enable the site
ln -sf /etc/nginx/sites-available/songup /etc/nginx/sites-enabled/

# Test Nginx config
nginx -t

# Reload Nginx
systemctl reload nginx
```

### 6. Start Docker Services

```bash
cd /srv/songup

# Start services in background
docker-compose up -d

# Wait 3-5 minutes for services to initialize
docker-compose logs -f
```

Press `Ctrl+C` when you see "ready - started server" in the logs.

### 7. Verify Installation

```bash
# Check all services are running
docker-compose ps

# Test services
curl http://localhost:3000
curl http://localhost:3210
curl http://localhost:5328
```

### 8. Access Your App

Open your browser and navigate to:
```
https://your-domain.com
```

## ✅ Verification Checklist

- [ ] All Docker containers are running: `docker-compose ps`
- [ ] Nginx is configured: `nginx -t`
- [ ] Domain is accessible: `https://your-domain.com`
- [ ] Frontend loads without errors
- [ ] Can create a music room

## 🛠️ Management Commands

### View Logs

```bash
# All services
cd /srv/songup && docker-compose logs -f

# Specific service
docker-compose logs -f nextjs
docker-compose logs -f convex-backend
docker-compose logs -f flask
```

### Restart Services

```bash
cd /srv/songup

# Restart all
docker-compose restart

# Restart specific service
docker-compose restart nextjs
```

### Update Application

```bash
cd /srv/songup

# Pull latest changes
git pull origin self-host

# Rebuild and restart
docker-compose up -d --force-recreate
```

### Database Backup

```bash
cd /srv/songup

# Create backup
docker-compose exec -T postgres pg_dump -U convex convex > backup-$(date +%Y%m%d-%H%M%S).sql

# List backups
ls -lh backup-*.sql
```

### Database Restore

```bash
cd /srv/songup

# Restore from backup
docker-compose exec -T postgres psql -U convex convex < backup-20260503-120000.sql
```

## 🔒 Security Recommendations

### 1. Change Database Password

Edit `/srv/songup/.env`:
```bash
DB_PASSWORD=$(openssl rand -base64 32)
```

Then restart:
```bash
docker-compose restart
```

### 2. Set Up Automated Backups

Create `/usr/local/bin/songup-backup.sh`:
```bash
#!/bin/bash
cd /srv/songup
docker-compose exec -T postgres pg_dump -U convex convex | gzip > /backup/songup-$(date +%Y%m%d-%H%M%S).sql.gz
# Keep only last 7 days
find /backup/songup-*.sql.gz -mtime +7 -delete
```

Make executable and add to crontab:
```bash
chmod +x /usr/local/bin/songup-backup.sh
echo "0 2 * * * /usr/local/bin/songup-backup.sh" | crontab -
```

### 3. Configure Firewall

```bash
# Allow only necessary ports externally
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp  # SSH
```

### 4. Monitor Disk Space

```bash
# Check Docker volume usage
docker system df

# Clean up old images/containers if needed
docker system prune -a
```

## 🆘 Troubleshooting

### Services Won't Start

```bash
cd /srv/songup

# Check logs
docker-compose logs

# Restart everything
docker-compose down
docker-compose up -d

# Check health
docker-compose ps
```

### Nginx Errors

```bash
# Test config
nginx -t

# Check Nginx logs
tail -f /var/log/nginx/error.log

# Reload config
systemctl reload nginx
```

### Cannot Access Domain

```bash
# Verify DNS
dig your-domain.com

# Check Nginx is listening
netstat -tuln | grep :443

# Check firewall
ufw status
```

### High CPU/Memory Usage

```bash
# Check container stats
docker stats

# Check logs for errors
docker-compose logs --tail=100
```

### Database Connection Issues

```bash
# Test PostgreSQL connection
docker-compose exec postgres psql -U convex -d convex -c "SELECT 1"

# Check logs
docker-compose logs postgres
```

## 📊 Monitoring

### Set Up Simple Monitoring

Create `/usr/local/bin/songup-monitor.sh`:
```bash
#!/bin/bash
cd /srv/songup
STATUS=$(docker-compose ps -q | wc -l)
EXPECTED=4

if [ "$STATUS" != "$EXPECTED" ]; then
    echo "Alert: Not all containers running. Restarting..."
    docker-compose restart
fi
```

Add to crontab to check every 5 minutes:
```bash
echo "*/5 * * * * /usr/local/bin/songup-monitor.sh" | crontab -
```

## 📝 YunoHost Integration Notes

- **App Location**: `/srv/songup`
- **Nginx Config**: `/etc/nginx/sites-available/songup`
- **SSL Certs**: YunoHost manages via Let's Encrypt
- **Data Directory**: `/srv/songup/postgres_data`
- **Logs**: `docker-compose logs` or `/var/log/docker/`

## 🔄 Updating YunoHost

If you update YunoHost, your Docker containers remain independent:

```bash
# After YunoHost update
cd /srv/songup

# Verify everything still works
docker-compose ps
docker-compose logs --tail=50

# If issues, restart
docker-compose restart
```

## ⚠️ Important Notes

1. **Backups**: Always backup PostgreSQL data before major updates
2. **DNS**: Ensure domain is properly pointing to your YunoHost instance
3. **Certificates**: YunoHost manages SSL automatically (no manual cert handling)
4. **Performance**: Start with default resources; scale if needed
5. **Logs**: Keep monitoring logs for errors in production

## 🆘 Support

- **YunoHost Docs**: https://yunohost.org
- **Docker Docs**: https://docs.docker.com
- **SongUp Issues**: https://github.com/rcaneill/songup/issues
- **Convex Docs**: https://docs.convex.dev

---

**Last Updated**: May 2026  
**YunoHost Version**: 11.0+  
**Docker Version**: 20.10+
