# NovaPay Backend Deployment Checklist

## ✅ Pre-Deployment Setup

### 1. Code Preparation
- [x] Production optimizations in Cargo.toml
- [x] Health check endpoint added (`/health`)
- [x] CORS configured for production domains
- [x] Environment variable validation
- [x] Database migration support (SQLite/PostgreSQL)
- [x] Production logging configuration

### 2. Deployment Files Created
- [x] `render.yaml` - Render.com service configuration
- [x] `Dockerfile` - Container deployment option
- [x] `build.sh` - Build script for Render
- [x] `start-production.sh` - Production startup script
- [x] `.env.production` - Production environment template
- [x] `RENDER_DEPLOYMENT.md` - Detailed deployment guide

### 3. Database Setup
- [x] SQLite migrations (existing)
- [x] PostgreSQL migrations (created)
- [x] Database connection handling for both types
- [x] Auto-migration on startup

## 🚀 Render.com Deployment Steps

### Step 1: Repository Setup
```bash
# Ensure all files are committed
git add .
git commit -m "Add production deployment configuration"
git push origin main
```

### Step 2: Create Render Service
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - **Name**: `novapay-backend`
   - **Environment**: `Rust`
   - **Build Command**: `cargo build --release`
   - **Start Command**: `./target/release/novapay-backend`

### Step 3: Environment Variables
Set these in Render Dashboard:

**Required:**
```
DATABASE_URL=sqlite:./novapay.db
JWT_SECRET=[generate-32-char-secret]
FONBNK_CLIENT_ID=[your-fonbnk-client-id]
FONBNK_API_SIGNATURE_SECRET=[your-fonbnk-api-secret]
FONBNK_URL_SIGNATURE_SECRET=[your-fonbnk-url-secret]
FONBNK_SOURCE_PARAM=[your-fonbnk-source]
```

**Optional:**
```
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
FRIENDBOT_URL=https://friendbot.stellar.org
FONBNK_BASE_URL=https://api.fonbnk.com
PORT=10000
RUST_LOG=info
```

### Step 4: Deploy
- Push code to trigger automatic deployment
- Monitor build logs in Render dashboard
- Test endpoints once deployed

## 🧪 Testing Deployment

### Health Check
```bash
curl https://your-app-name.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "novapay-backend",
  "version": "0.1.0",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### API Endpoints Test
```bash
# Test registration
curl -X POST https://your-app-name.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","full_name":"Test User"}'

# Test login
curl -X POST https://your-app-name.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🔒 Security Checklist

- [ ] Strong JWT secret (32+ characters)
- [ ] Environment variables secured (not in code)
- [ ] HTTPS enabled (automatic on Render)
- [ ] CORS properly configured
- [ ] Database credentials secured
- [ ] API keys not exposed in logs
- [ ] Input validation enabled
- [ ] Rate limiting considered (future)

## 📊 Monitoring & Maintenance

### Logs
- Monitor application logs in Render dashboard
- Set up log alerts for errors
- Track performance metrics

### Database
- Monitor database size (SQLite has limits)
- Plan PostgreSQL migration for scale
- Regular backups (Render handles this)

### Updates
- Test changes locally first
- Use staging environment (recommended)
- Monitor deployment for issues
- Have rollback plan ready

## 🚨 Troubleshooting

### Build Failures
1. Check Rust version compatibility
2. Verify Cargo.toml dependencies
3. Review build logs for specific errors
4. Test build locally: `cargo build --release`

### Runtime Issues
1. Check environment variables
2. Verify database connection
3. Review application logs
4. Test endpoints individually

### Performance Issues
1. Monitor response times
2. Check database query performance
3. Consider upgrading Render plan
4. Implement caching if needed

## 📈 Scaling Considerations

### Current Setup (Free Tier)
- Single instance
- SQLite database
- Basic monitoring
- HTTPS included

### Production Scaling
- Upgrade to paid Render plan
- Switch to PostgreSQL
- Add Redis for caching
- Implement load balancing
- Set up monitoring/alerting
- Add CI/CD pipeline

## ✅ Post-Deployment

- [ ] Verify all endpoints work
- [ ] Test user registration/login flow
- [ ] Confirm database operations
- [ ] Check Fonbnk integration
- [ ] Monitor logs for errors
- [ ] Update frontend API URL
- [ ] Document production URL
- [ ] Set up monitoring alerts