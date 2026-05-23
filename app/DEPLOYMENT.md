# 🚀 Deployment Guide - Sumi Sensei

Complete guide to deploy Sumi Sensei to production using Vercel, Docker, or traditional hosting.

## 📋 Table of Contents

- [Vercel (Recommended)](#vercel-recommended)
- [Docker Deployment](#docker-deployment)
- [Traditional Hosting](#traditional-hosting)
- [CI/CD Pipeline](#cicd-pipeline)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## 🔧 Vercel (Recommended)

Vercel is the simplest and fastest way to deploy this app. **FREE tier available!**

### Step 1: Prepare Your Project
```bash
cd Learnyourbaby/app
npm install
npm run build  # Verify build works locally
```

### Step 2: Deploy Using Vercel CLI (Fastest)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

Follow the prompts:
- Project name: `sumi-sensei`
- Framework: `Vite`
- Build command: `npm run build` (default is fine)
- Output directory: `dist`
- Enable source maps: `No`

**Done!** Your app will be live in seconds! ✨

### Step 3: Deploy Via GitHub Integration (Best for Teams)

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Select **"Import Git Repository"**
4. Connect your GitHub account
5. Select `madan123051/Learnyourbaby`
6. Configure:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
7. Click **"Deploy"**

**Automatic deployments**: Every time you push to GitHub, Vercel auto-deploys!

### Step 4: Custom Domain (Optional)
1. In Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

---

## 🐳 Docker Deployment

For self-hosted servers or cloud platforms (AWS, GCP, Azure, DigitalOcean, etc.)

### Prerequisites
- Docker & Docker Compose installed
- Server with at least 512MB RAM

### Quick Start

```bash
# Build & Run locally
docker-compose up --build

# App will be available at http://localhost:3000
```

### Deploy to Cloud

#### **Option A: DigitalOcean App Platform**
1. Connect GitHub repository
2. Select `Learnyourbaby` repo
3. Choose **Dockerfile** as build source
4. Set port to 3000
5. Deploy!

#### **Option B: AWS ECS**
```bash
# Push to AWS ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

docker build -t sumi-sensei:latest .

docker tag sumi-sensei:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/sumi-sensei:latest

docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/sumi-sensei:latest
```

Then create an ECS service using this image.

#### **Option C: Heroku (Deprecated but still works)**
```bash
# Install Heroku CLI
# Then: heroku login
# heroku create sumi-sensei-app
# git push heroku main
```

---

## 🌐 Traditional Hosting

For servers with SSH access (VPS, shared hosting, etc.)

### Prerequisites
- Node.js 16+ installed on server
- SSH access to server

### Deployment Steps

```bash
# 1. SSH into your server
ssh user@your-server.com

# 2. Clone the repository
git clone https://github.com/madan123051/Learnyourbaby.git
cd Learnyourbaby/app

# 3. Install dependencies
npm install

# 4. Build the app
npm run build

# 5. Install PM2 for process management
npm install -g pm2

# 6. Start the app with PM2
pm2 start "npm run preview" --name "sumi-sensei"
pm2 save
pm2 startup

# 7. Setup Nginx reverse proxy (optional but recommended)
sudo apt-get install nginx
```

### Nginx Configuration

Create `/etc/nginx/sites-available/sumi-sensei`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable it:
```bash
sudo ln -s /etc/nginx/sites-available/sumi-sensei /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Auto-Deploy

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install dependencies
        run: npm install
        working-directory: app
      
      - name: Build
        run: npm run build
        working-directory: app
      
      - name: Deploy to Vercel
        uses: BeyondCodeBootcamp/github-action-vercel@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: --prod
          working-directory: app
```

Setup secrets in GitHub:
1. Go to Settings → Secrets → Actions
2. Add `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

---

## 🔐 Environment Variables

### For Vercel Dashboard

1. Go to Project Settings → Environment Variables
2. Add these variables:

```
VITE_APP_NAME=Sumi Sensei
VITE_APP_VERSION=1.0.0
VITE_ENABLE_AI_CHAT=true
VITE_ENABLE_OFFLINE_MODE=true
```

### For Future Gemini Integration
```
VITE_GEMINI_API_KEY=your_key_here
```

---

## 📊 Performance Tips

1. **Enable Vercel Analytics**: Dashboard → Analytics → Enable
2. **Enable Caching**: Project Settings → Caching → Enable
3. **Optimize Images**: Use WebP format
4. **Monitor Performance**: Vercel Dashboard → Insights

---

## 🚨 Troubleshooting

### Build Fails on Vercel

```bash
# Check build locally first
npm run build

# If error persists, check:
npm list
npm audit fix
npm run type-check
```

### Docker Container Won't Start

```bash
# Check logs
docker logs <container-id>

# Rebuild
docker-compose down
docker-compose up --build
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
PORT=3001 npm run preview
```

### High Memory Usage

```bash
# Reduce Node memory limit
NODE_OPTIONS="--max-old-space-size=512" npm run build
```

---

## 📈 Monitoring & Maintenance

### Monitor with Vercel
- Dashboard → Insights → Check metrics
- Set up alerts for deployment failures

### Monitor with PM2
```bash
pm2 monit
pm2 log sumi-sensei
```

### Keep Dependencies Updated
```bash
npm outdated
npm update
npm audit fix
```

---

## 🎉 Success!

Your app is now live! Share the URL with everyone! 🌍👶📚

---

## 📞 Support

- **Issues**: Open on GitHub
- **Questions**: Start a discussion
- **Bug Reports**: Detailed error logs in issues

Happy deploying! 🚀✨
