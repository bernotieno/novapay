# 🚀 NovaPay Production Deployment Guide

## Quick Deploy Options

### Option 1: Render.com (Recommended)
```bash
# 1. Generate production secrets
openssl rand -hex 32  # Use for JWT_SECRET

# 2. Push to GitHub
git add .
git commit -m "Production ready"
git push origin main

# 3. Deploy on Render
# - Go to render.com
# - Connect GitHub repo
# - Set environment variables
# - Deploy using render.yaml
```

### Option 2: VPS/Cloud Server
```bash
# 1. Prepare server
sudo apt update && sudo apt install -y postgresql postgresql-contrib nginx certbot

# 2. Setup database
sudo -u postgres createuser novapay
sudo -u postgres createdb novapay -O novapay
sudo -u postgres psql -c "ALTER USER novapay PASSWORD 'secure_password';"

# 3. Deploy application
./deploy.sh

# 4. Setup SSL
sudo certbot --nginx -d yourdomain.com
```

### Option 3: Docker
```bash
# 1. Set environment variables
export DB_PASSWORD="$(openssl rand -hex 16)"
export JWT_SECRET="$(openssl rand -hex 32)"

# 2. Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## Environment Variables Setup

### Required Production Variables
```bash
# Generate secure secrets
JWT_SECRET=$(openssl rand -hex 32)
DB_PASSWORD=$(openssl rand -hex 16)

# Set in your deployment platform
DATABASE_URL=postgresql://novapay:$DB_PASSWORD@localhost:5432/novapay
JWT_SECRET=$JWT_SECRET
FONBNK_CLIENT_ID=your_fonbnk_client_id
FONBNK_API_SIGNATURE_SECRET=your_fonbnk_api_secret
FONBNK_URL_SIGNATURE_SECRET=your_fonbnk_url_secret
FONBNK_SOURCE_PARAM=your_fonbnk_source
```

## Testing Production Deployment

### 1. Health Check
```bash
curl https://yourdomain.com/health
```

### 2. API Test
```bash
# Register user
curl -X POST https://yourdomain.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","phone_number":"+254700000000"}'

# Login
curl -X POST https://yourdomain.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

## Monitoring Commands

### Service Status
```bash
# Systemd service
sudo systemctl status novapay

# Docker
docker-compose -f docker-compose.prod.yml ps
```

### Logs
```bash
# Systemd
sudo journalctl -u novapay -f

# Docker
docker-compose -f docker-compose.prod.yml logs -f
```

### Database Backup
```bash
# Manual backup
./backup.sh

# Schedule daily backups
echo "0 2 * * * /opt/novapay/backup.sh" | sudo crontab -
```

## Performance Optimization

### Database Indexing
```sql
-- Add indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
```

### Connection Pooling
Already configured in Cargo.toml with SQLx connection pooling.

## Security Hardening

### Firewall Setup
```bash
# UFW firewall
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

### SSL Certificate (Let's Encrypt)
```bash
sudo certbot --nginx -d yourdomain.com
sudo systemctl enable certbot.timer
```

## Troubleshooting

### Common Issues
1. **Port 10000 not accessible**: Check firewall rules
2. **Database connection failed**: Verify DATABASE_URL
3. **JWT errors**: Ensure JWT_SECRET is set
4. **Fonbnk API errors**: Check Fonbnk credentials

### Debug Commands
```bash
# Check environment variables
sudo systemctl show novapay --property=Environment

# Test database connection
psql "$DATABASE_URL" -c "SELECT 1;"

# Check application logs
sudo journalctl -u novapay --since "1 hour ago"
```

## Scaling Considerations

### Load Balancing
- Use nginx upstream for multiple instances
- Configure session affinity if needed
- Monitor CPU and memory usage

### Database Scaling
- Enable connection pooling (already configured)
- Consider read replicas for high traffic
- Monitor query performance

## Maintenance

### Updates
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
cargo build --release
sudo systemctl restart novapay
```

### Health Monitoring
```bash
# Add to crontab for monitoring
*/5 * * * * /opt/novapay/health-check.sh || echo "API DOWN" | mail admin@yourdomain.com
```

Your NovaPay backend is now production-ready! 🎉