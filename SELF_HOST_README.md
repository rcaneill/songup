# 🎵 SongUp Self-Host Branch

This branch contains a complete self-hosted deployment configuration for SongUp using Docker Compose.

## 📦 What's Included

- **docker-compose.yml** - Full containerized stack (Next.js, Convex, Flask, PostgreSQL)
- **.env.self-host** - Environment variables template
- **SELF_HOST_GUIDE.md** - Comprehensive deployment documentation
- **next.config.ts** - Updated with environment-based URL configuration

## 🚀 Quick Start

```bash
# Checkout branch
git checkout self-host

# Copy environment template
cp .env.self-host .env

# Start all services
docker-compose up -d

# Access at http://localhost:3000
```

## 📋 Services

| Service | Port | Purpose |
|---------|------|---------|
| Next.js | 3000 | Web frontend |
| Convex Backend | 3210 | Database & functions |
| Flask API | 5328 | Music service |
| PostgreSQL | 5432 | Data storage |

## 🔧 Configuration

Edit `.env` to customize:
- Database credentials
- Convex/Flask URLs
- Optional integrations (Stripe, PostHog)

## 📚 Documentation

See **SELF_HOST_GUIDE.md** for:
- Architecture details
- Troubleshooting
- Production setup
- Database management
- Security recommendations

## ✅ Minimal Changes

Only 1 file modified from main branch:
- `next.config.ts` - Added support for `FLASK_URL` and `DOCS_DOMAIN` environment variables (fully backward compatible)

## 🆘 Need Help?

Check the troubleshooting section in **SELF_HOST_GUIDE.md** or review container logs:

```bash
docker-compose logs -f <service-name>
```

---

**Branch**: `self-host` | **Base**: `develop` | **Status**: ✅ Ready to deploy
