# NovaPay Backend Deployment on Render.com

## Prerequisites

1. **Render.com Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Environment Variables**: Prepare your production secrets

## Deployment Steps

### 1. Create Web Service on Render

1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `novapay-backend`
   - **Environment**: `Rust`
   - **Build Command**: `cargo build --release`
   - **Start Command**: `./target/release/novapay-backend`
   - **Plan**: Free (or paid for production)

### 2. Set Environment Variables

In Render Dashboard → Environment tab, add:

```
DATABASE_URL=postgresql://[render-provided-url]
JWT_SECRET=[generate-strong-32-char-secret]
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
FRIENDBOT_URL=https://friendbot.stellar.org
SOROBAN_CONTRACT_ID=[your-contract-id]
FONBNK_CLIENT_ID=[your-fonbnk-client-id]
FONBNK_API_SIGNATURE_SECRET=[your-fonbnk-api-secret]
FONBNK_URL_SIGNATURE_SECRET=[your-fonbnk-url-secret]
FONBNK_SOURCE_PARAM=[your-fonbnk-source]
FONBNK_BASE_URL=https://api.fonbnk.com
PORT=10000
RUST_LOG=info
```

### 3. Add PostgreSQL Database

1. In Render Dashboard, create a new PostgreSQL database
2. Copy the connection string to `DATABASE_URL`
3. The database will auto-migrate on first run

### 4. Deploy

1. Push your code to GitHub
2. Render will automatically build and deploy
3. Monitor logs for any issues

## Production Checklist

- [ ] Strong JWT secret (32+ characters)
- [ ] Real Fonbnk API credentials
- [ ] PostgreSQL database connected
- [ ] HTTPS enabled (automatic on Render)
- [ ] Environment variables secured
- [ ] Logs monitoring enabled
- [ ] Health checks configured

## API Endpoints

Your deployed API will be available at:
`https://novapay-backend.onrender.com`

### Health Check
```bash
curl https://novapay-backend.onrender.com/auth/login
```

## Troubleshooting

### Build Failures
- Check Rust version compatibility
- Verify all dependencies in Cargo.toml
- Review build logs in Render dashboard

### Runtime Issues
- Check environment variables
- Verify database connection
- Monitor application logs

### Database Issues
- Ensure PostgreSQL is connected
- Check migration files
- Verify connection string format

## Security Notes

1. **Never commit secrets** to version control
2. **Use strong JWT secrets** (minimum 32 characters)
3. **Enable HTTPS** (automatic on Render)
4. **Rotate API keys** regularly
5. **Monitor access logs**

## Scaling

For production traffic:
1. Upgrade to paid Render plan
2. Enable auto-scaling
3. Add database connection pooling
4. Implement caching layer
5. Set up monitoring and alerts