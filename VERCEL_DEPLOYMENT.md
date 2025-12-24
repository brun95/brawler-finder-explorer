# Deploy to Vercel with Proxy Setup

This guide shows how to deploy your app to Vercel (free) while using a proxy on DigitalOcean Droplet for API calls.

## Architecture
```
User → Vercel (Next.js) → Proxy on Droplet → Brawl Stars API
                          (Static IP)
```

## Step 1: Create DigitalOcean Droplet

1. Go to DigitalOcean → Create → Droplets
2. Choose **Ubuntu 24.04 LTS**
3. Size: **Basic Plan - $4/month** (512MB RAM is enough for proxy)
4. Add your SSH key
5. Create Droplet
6. **Note the IP address** (e.g., `123.45.67.89`)

## Step 2: Deploy Proxy Server

SSH into your droplet:
```bash
ssh root@YOUR_DROPLET_IP
```

Run the deployment script:
```bash
curl -o deploy-proxy.sh https://raw.githubusercontent.com/brun95/brawler-finder-explorer/main/deploy-proxy.sh
chmod +x deploy-proxy.sh
./deploy-proxy.sh
```

When prompted, edit the `.env` file:
```bash
nano .env
```

Add your Brawl Stars API key with the **Droplet's IP whitelisted**.

## Step 3: Update Brawl Stars API Key

1. Go to https://developer.brawlstars.com/#/
2. Create new API key
3. Add your **Droplet's IP address** (from Step 1)
4. Copy the key and paste it in the Droplet's `.env` file

## Step 4: Test Proxy

```bash
curl http://YOUR_DROPLET_IP:5000/brawlers
```

You should see JSON data. If you get an error, check:
```bash
pm2 logs proxy-server
```

## Step 5: Deploy to Vercel

1. Push your code to GitHub:
```bash
git add -A
git commit -m "Add proxy support for Vercel deployment"
git push
```

2. Go to https://vercel.com
3. Click "Add New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `PROXY_SERVER_URL` = `http://YOUR_DROPLET_IP:5000`
   - `SUPABASE_URL` = (your Supabase URL)
   - `SUPABASE_SERVICE_ROLE_KEY` = (your Supabase key)
   - `DATABASE_URL` = (your Supabase connection string)
6. Deploy!

## Step 6: Secure the Proxy (Optional but Recommended)

After basic deployment works, secure it:

```bash
# On your Droplet
sudo apt install nginx certbot python3-certbot-nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/proxy
```

Add:
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable and get SSL:
```bash
sudo ln -s /etc/nginx/sites-available/proxy /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d YOUR_DOMAIN.com
```

Then update Vercel env to use `https://YOUR_DOMAIN.com` instead of `http://IP:5000`

## Troubleshooting

### Proxy not responding
```bash
pm2 logs proxy-server
pm2 restart proxy-server
```

### Vercel deployment fails
- Check environment variables are set correctly
- Check build logs in Vercel dashboard

### API still returns 403
- Verify Droplet IP is whitelisted in Brawl Stars API
- Test proxy directly: `curl http://YOUR_DROPLET_IP:5000/brawlers`
- Check proxy logs: `pm2 logs proxy-server`

## Cost Breakdown
- **Vercel**: Free (up to 100GB bandwidth)
- **DigitalOcean Droplet**: $4-6/month
- **Total**: ~$5/month
