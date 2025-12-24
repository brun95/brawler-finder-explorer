# Deploy to DigitalOcean Droplet

Complete guide to deploy your entire app on a single Droplet.

## Step 1: Create Droplet (5 minutes)

1. Go to https://cloud.digitalocean.com/droplets
2. Click **"Create Droplet"**
3. Choose:
   - **Image**: Ubuntu 24.04 LTS
   - **Size**: Basic - $6/month (1GB RAM, 1 vCPU)
   - **Datacenter**: Choose closest to your users
   - **Authentication**: SSH Key (recommended) or Password
4. Click **"Create Droplet"**
5. **Note the IP address** (e.g., 157.230.45.123)

## Step 2: Add IP to Brawl Stars API

1. Go to https://developer.brawlstars.com/#/
2. Create new API key
3. Add your **Droplet's IP address**
4. Copy the API key

## Step 3: Deploy App (10 minutes)

### SSH into your Droplet:
```bash
ssh root@YOUR_DROPLET_IP
```

### Download and run deployment script:
```bash
curl -o deploy.sh https://raw.githubusercontent.com/brun95/brawler-finder-explorer/main/deploy-droplet.sh
chmod +x deploy.sh
./deploy.sh
```

### When prompted, edit the .env file:
```bash
nano .env
```

Update these values:
- `SECRET_API_KEY` - Your Brawl Stars API key (from Step 2)
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase key (if using)

Press `Ctrl+X`, then `Y`, then `Enter` to save.

Press Enter to continue the script.

## Step 4: Test Your App

Open in browser:
```
http://YOUR_DROPLET_IP
```

You should see your app! 🎉

Test API endpoints:
```bash
curl http://YOUR_DROPLET_IP/api/brawlers
curl http://YOUR_DROPLET_IP/api/players/2G0VQ0YLC
```

## Step 5: Add Domain + SSL (Optional)

If you have a domain:

### Point domain to Droplet:
1. In your domain registrar, add an A record:
   - Name: `@` (or subdomain like `app`)
   - Value: Your Droplet's IP
   - TTL: 300

### Install SSL certificate:
```bash
ssh root@YOUR_DROPLET_IP
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

Now access via: `https://yourdomain.com` 🔒

## Managing Your App

### View logs:
```bash
ssh root@YOUR_DROPLET_IP
pm2 logs brawl-stars-app
```

### Restart app:
```bash
pm2 restart brawl-stars-app
```

### Update code:
```bash
cd ~/brawler-finder-explorer
git pull
npm install
npm run build
pm2 restart brawl-stars-app
```

### Edit environment variables:
```bash
cd ~/brawler-finder-explorer
nano .env
pm2 restart brawl-stars-app
```

## Troubleshooting

### Can't access the app
```bash
# Check if app is running
pm2 status

# Check logs
pm2 logs brawl-stars-app

# Check Nginx
sudo systemctl status nginx
sudo nginx -t
```

### 403 from Brawl Stars API
- Verify Droplet IP is whitelisted in Brawl Stars API
- Check `SECRET_API_KEY` is correct in .env
- Restart: `pm2 restart brawl-stars-app`

### App crashes
```bash
# View error logs
pm2 logs brawl-stars-app --err

# Restart
pm2 restart brawl-stars-app
```

## Cost

- **Droplet**: $6/month
- **Database**: Free (SQLite on Droplet) or Supabase free tier
- **Total**: $6/month

## Backup (Recommended)

Enable automatic backups in DigitalOcean:
1. Go to Droplet settings
2. Enable "Backups" (+20% cost = $7.20/month)

Or create manual snapshots for free.
