#!/bin/bash
# Deploy proxy server to DigitalOcean Droplet
# Usage: Run this script on your Droplet after SSH'ing in

set -e

echo "🚀 Installing Node.js and dependencies..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

echo "📦 Installing PM2 process manager..."
sudo npm install -g pm2

echo "📥 Cloning repository..."
cd ~
if [ -d "brawler-finder-explorer" ]; then
    cd brawler-finder-explorer
    git pull
else
    git clone https://github.com/brun95/brawler-finder-explorer.git
    cd brawler-finder-explorer
fi

echo "🔧 Installing dependencies..."
npm install express cors axios dotenv

echo "📝 Creating .env file..."
cat > .env << 'EOF'
NEXT_PUBLIC_PUBLIC_BASE_URL=https://api.brawlstars.com/v1
NEXT_PUBLIC_PUBLIC_BASE_CDN_URL=https://api.brawlify.com/v1
SECRET_API_KEY=your-api-key-here
EOF

echo "⚠️  IMPORTANT: Edit .env and add your Brawl Stars API key!"
echo "Run: nano .env"
echo ""
read -p "Press Enter after you've updated the .env file..."

echo "🚀 Starting proxy server with PM2..."
pm2 delete proxy-server 2>/dev/null || true
pm2 start proxyServer.js --name proxy-server
pm2 save
pm2 startup

echo "✅ Proxy server deployed!"
echo "📍 Running on: http://$(curl -s ifconfig.me):5000"
echo ""
echo "🔥 Useful commands:"
echo "  pm2 logs proxy-server  - View logs"
echo "  pm2 restart proxy-server - Restart"
echo "  pm2 stop proxy-server - Stop"
