# Career Site Application

A Next.js application for managing job postings and student applications, built with Next.js, NextAuth.js, Prisma, and Tailwind CSS.

## Prerequisites

- Ubuntu Server (20.04 LTS or later)
- Node.js (v18 or later)
- npm (v9 or later)
- SQLite3
- Git

## Installation Steps

1. **Update System Packages**
   ```bash
   sudo apt update
   sudo apt upgrade -y
   ```

2. **Install Node.js and npm**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

3. **Install SQLite3**
   ```bash
   sudo apt install sqlite3
   ```

4. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd careersite-1
   ```

5. **Install Dependencies**
   ```bash
   npm install
   ```

6. **Set Up Environment Variables**
   Create a `.env` file in the root directory:
   ```bash
   touch .env
   ```
   Add the following content:
   ```
   DATABASE_URL="file:./prisma/dev.db"
   NEXTAUTH_URL="http://your-server-ip:3000"
   NEXTAUTH_SECRET="your-secret-key" # Generate a random string
   ```

7. **Initialize the Database**
   ```bash
   npx prisma migrate reset --force
   ```

8. **Create Admin User**
   ```bash
   curl -X POST http://localhost:3000/api/setup
   ```

## Running the Application

1. **Development Mode**
   ```bash
   npm run dev
   ```

2. **Production Mode**
   ```bash
   npm run build
   npm start
   ```

## Using PM2 for Process Management

1. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

2. **Start the Application with PM2**
   ```bash
   pm2 start npm --name "careersite" -- start
   ```

3. **Configure PM2 to Start on Boot**
   ```bash
   pm2 startup
   pm2 save
   ```

## Setting Up Nginx as a Reverse Proxy

1. **Install Nginx**
   ```bash
   sudo apt install nginx
   ```

2. **Configure Nginx**
   Create a new configuration file:
   ```bash
   sudo nano /etc/nginx/sites-available/careersite
   ```
   Add the following configuration:
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

3. **Enable the Site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/careersite /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Security Considerations

1. **Set Up SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

2. **Configure Firewall**
   ```bash
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```

## Maintenance

1. **Backup Database**
   ```bash
   cp prisma/dev.db prisma/backup-$(date +%Y%m%d).db
   ```

2. **Update Application**
   ```bash
   git pull
   npm install
   npx prisma migrate deploy
   pm2 restart careersite
   ```

## Default Admin Credentials

- Email: admin@example.com
- Password: admin123

**Important**: Change the admin password after first login.

## Troubleshooting

1. **Check Application Logs**
   ```bash
   pm2 logs careersite
   ```

2. **Check Nginx Logs**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Database Issues**
   ```bash
   npx prisma migrate reset --force
   ```

## Support

For any issues or questions, please contact the development team.
