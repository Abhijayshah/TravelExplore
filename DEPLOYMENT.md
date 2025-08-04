# TravelExplore Deployment Guide

## 🚀 MongoDB Integration & Deployment Ready

This application has been upgraded from JSON file storage to MongoDB and is now production-ready with Docker containerization.

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB 7.0+ (local) OR MongoDB Atlas (cloud)
- Docker & Docker Compose (for containerized deployment)
- Git

## 🛠️ Local Development Setup

### 1. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 2. MongoDB Setup (Choose one)

#### Option A: Local MongoDB
```bash
# Install MongoDB locally
brew install mongodb/brew/mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community

# Use default connection string in .env:
MONGODB_URI=mongodb://localhost:27017/travelexplore
```

#### Option B: MongoDB Atlas (Cloud)
```bash
# Create account at https://cloud.mongodb.com
# Create cluster and get connection string
# Update .env with your Atlas connection string:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/travelexplore
```

### 3. Install Dependencies & Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or start production server
npm start
```

## 🐳 Docker Deployment

### Quick Start with Docker Compose

```bash
# Build and start all services
npm run docker:run

# View logs
npm run docker:logs

# Stop services
npm run docker:stop
```

### Manual Docker Commands

```bash
# Build image
docker build -t travelexplore .

# Run with docker-compose
docker-compose up -d

# Scale application
docker-compose up -d --scale app=3
```

## 🌐 Production Deployment

### 1. Cloud Platforms

#### Heroku
```bash
# Install Heroku CLI
# Login and create app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-atlas-uri
heroku config:set JWT_SECRET=your-secret-key

# Deploy
git push heroku main
```

#### AWS ECS/Fargate
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com
docker build -t travelexplore .
docker tag travelexplore:latest your-account.dkr.ecr.us-east-1.amazonaws.com/travelexplore:latest
docker push your-account.dkr.ecr.us-east-1.amazonaws.com/travelexplore:latest
```

#### DigitalOcean App Platform
```bash
# Connect GitHub repository
# Set environment variables in dashboard
# Deploy automatically on push
```

### 2. VPS Deployment

```bash
# On your VPS
git clone https://github.com/yourusername/travelexplore.git
cd travelexplore

# Install dependencies
npm ci --production

# Set up environment
cp .env.example .env
# Edit .env with production values

# Install PM2 for process management
npm install -g pm2

# Start application
pm2 start ecosystem.config.js

# Set up nginx reverse proxy
sudo nano /etc/nginx/sites-available/travelexplore
```

## 📊 Database Management

### MongoDB Compass (GUI)
```bash
# Download from https://www.mongodb.com/products/compass
# Connect using your MongoDB URI
```

### Mongo Express (Web Interface)
```bash
# Included in docker-compose.yml
# Access at http://localhost:8081
# Username: admin, Password: admin123
```

### Command Line
```bash
# Connect to MongoDB
mongo mongodb://localhost:27017/travelexplore

# Or with authentication
mongo mongodb://admin:password123@localhost:27017/travelexplore?authSource=admin
```

## 🔧 Environment Variables

### Required Variables
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secret-jwt-key
```

### Optional Variables
```env
CORS_ORIGIN=https://yourdomain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

## 🔒 Security Checklist

- [ ] Change default JWT secret
- [ ] Use strong MongoDB passwords
- [ ] Enable MongoDB authentication
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular security updates

## 📈 Monitoring & Logging

### Health Checks
```bash
# Application health
curl http://localhost:3000/api/health

# Docker health
docker ps
```

### Logs
```bash
# Application logs
npm run docker:logs

# MongoDB logs
docker logs travelexplore-mongodb
```

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   ```bash
   # Check MongoDB status
   docker ps | grep mongo
   
   # Check connection string
   echo $MONGODB_URI
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   
   # Kill process
   kill -9 PID
   ```

3. **Docker Build Issues**
   ```bash
   # Clean Docker cache
   docker system prune -a
   
   # Rebuild without cache
   docker build --no-cache -t travelexplore .
   ```

## 📞 Support

For deployment issues:
1. Check logs first
2. Verify environment variables
3. Test database connectivity
4. Review security settings

## 🔄 Updates

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
npm run docker:stop
npm run docker:run
```

---

**Note**: This application is now production-ready with MongoDB integration, Docker containerization, and comprehensive security measures.