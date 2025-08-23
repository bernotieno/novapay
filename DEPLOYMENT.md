# NovaPay Frontend Deployment Guide

## Render.com Deployment

### Prerequisites
- GitHub repository with your code
- Render.com account

### Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare frontend for production deployment"
   git push origin main
   ```

2. **Create a new Web Service on Render.com**
   - Connect your GitHub repository
   - Use the following settings:
     - **Build Command**: `cd frontend && npm ci && npm run build`
     - **Start Command**: `cd frontend && npm run start`
     - **Environment**: Node

3. **Set Environment Variables**
   - `NODE_ENV`: `production`
   - `VITE_API_BASE_URL`: Your backend URL (update when backend is deployed)
   - `VITE_STELLAR_NETWORK`: `testnet`

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your frontend

### Local Production Testing

Test the production build locally:

```bash
cd frontend
npm run build
npm run start
```

### Environment Configuration

- **Development**: Uses `.env` or defaults to localhost:3000
- **Production**: Uses environment variables set in Render.com

### Notes

- The frontend is configured as a Single Page Application (SPA)
- All routes are handled by React Router
- Static assets are served from the `public` directory
- The build is optimized with code splitting for better performance

### Next Steps

1. Deploy the backend to Render.com
2. Update `VITE_API_BASE_URL` environment variable with the backend URL
3. Configure CORS in the backend to allow requests from the frontend domain