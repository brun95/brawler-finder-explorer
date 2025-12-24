#!/bin/bash
# Complete deployment script for DigitalOcean Droplet
# Run this script on your fresh Ubuntu 24.04 Droplet

set -e

echo "🚀 Brawl Stars App - Droplet Deployment"
echo "========================================"
echo ""

# Update system
echo "📦 Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Install Node.js 20
echo "📦 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
echo "📦 Installing PM2 process manager..."
sudo npm install -g pm2

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install -y nginx

# Clone repository
echo "📥 Cloning repository..."
cd ~
if [ -d "brawler-finder-explorer" ]; then
    cd brawler-finder-explorer
    git pull
else
    git clone https://github.com/brun95/brawler-finder-explorer.git
    cd brawler-finder-explorer
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file
echo "📝 Creating .env file..."
cat > .env << 'EOF'
NEXT_PUBLIC_ENABLE_ADS=false
NEXT_PUBLIC_ADSENSE_CLIENT_ID=your-adsense-client-id
NEXT_PUBLIC_PUBLIC_BASE_URL=https://api.brawlstars.com/v1
NEXT_PUBLIC_PUBLIC_BASE_CDN_URL=https://api.brawlify.com/v1
SECRET_API_KEY=your-brawl-stars-api-key-here
DATABASE_URL=file:./dev.db
SUPABASE_URL=https://djhcsmvyykevekkmjrqa.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-key-here
EOF

echo ""
echo "⚠️  IMPORTANT: Edit the .env file and add your API keys!"
echo "Run: nano .env"
echo ""
read -p "Press Enter after you've updated the .env file..."

# Build the app
echo "🔨 Building Next.js app..."
npm run build

# Start with PM2
echo "🚀 Starting app with PM2..."
pm2 delete brawl-stars-app 2>/dev/null || true
pm2 start npm --name "brawl-stars-app" -- start
pm2 save
pm2 startup

# Configure Nginx
echo "🔧 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/brawl-stars-app > /dev/null << 'NGINX_EOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX_EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/brawl-stars-app /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx

# Get Droplet IP
DROPLET_IP=$(curl -s ifconfig.me)

echo ""
echo "✅ Deployment Complete!"
echo "======================="
echo ""
echo "📍 Your app is running at: http://$DROPLET_IP"
echo "🔑 Droplet IP: $DROPLET_IP"
echo ""
echo "⚠️  IMPORTANT NEXT STEPS:"
echo "1. Add this IP ($DROPLET_IP) to your Brawl Stars API key whitelist"
echo "2. Update the SECRET_API_KEY in .env file"
echo "3. Restart the app: pm2 restart brawl-stars-app"
echo ""
echo "🔧 Useful commands:"
echo "  pm2 logs brawl-stars-app  - View logs"
echo "  pm2 restart brawl-stars-app - Restart app"
echo "  pm2 stop brawl-stars-app - Stop app"
echo "  nano .env - Edit environment variables"
echo ""
echo "🌐 To add a domain and SSL:"
echo "  1. Point your domain to: $DROPLET_IP"
echo "  2. Run: sudo certbot --nginx -d yourdomain.com"
echo ""
