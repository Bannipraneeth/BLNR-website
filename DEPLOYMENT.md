# BLNR E-commerce Deployment Guide

## 1. Environment Setup

### Backend (.env)
Create a `.env` file in the backend directory with the following variables:
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/blnr-ecommerce

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Email Configuration (for OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880 # 5MB in bytes

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Admin Configuration
ADMIN_EMAIL=admin@blnr.com
ADMIN_PASSWORD=your_secure_password
```

### Frontend (.env.local)
Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 2. Production Build Steps

### Backend
1. Install dependencies:
```bash
cd backend
npm install --production
```

2. Build the application:
```bash
npm run build
```

3. Start the server:
```bash
npm start
```

### Frontend
1. Install dependencies:
```bash
cd frontend
npm install --production
```

2. Build the application:
```bash
npm run build
```

3. Start the server:
```bash
npm start
```

## 3. Security Checklist

### Backend
- [ ] Enable CORS with specific origins
- [ ] Implement rate limiting
- [ ] Set up proper error handling
- [ ] Configure secure headers
- [ ] Set up request validation
- [ ] Implement file upload size limits
- [ ] Set up proper logging
- [ ] Configure secure session management

### Frontend
- [ ] Implement proper error boundaries
- [ ] Set up loading states
- [ ] Configure proper caching
- [ ] Implement SEO optimization
- [ ] Set up proper image optimization
- [ ] Configure security headers
- [ ] Implement proper form validation

## 4. Performance Optimization

### Backend
- [ ] Implement caching (Redis recommended)
- [ ] Set up database indexing
- [ ] Configure compression
- [ ] Implement request batching
- [ ] Set up proper logging and monitoring

### Frontend
- [ ] Implement code splitting
- [ ] Set up proper caching strategies
- [ ] Optimize images and assets
- [ ] Implement lazy loading
- [ ] Set up proper error tracking

## 5. Deployment Options

### Option 1: Traditional VPS (e.g., DigitalOcean, AWS EC2)
1. Set up a VPS with Ubuntu/Debian
2. Install Node.js, MongoDB, and Nginx
3. Configure Nginx as reverse proxy
4. Set up PM2 for process management
5. Configure SSL with Let's Encrypt

### Option 2: Containerized Deployment (Docker)
1. Create Dockerfile for backend
2. Create Dockerfile for frontend
3. Set up docker-compose.yml
4. Configure Docker networks
5. Set up Docker volumes for persistence

### Option 3: Cloud Platform (e.g., Heroku, Vercel)
1. Configure buildpacks
2. Set up environment variables
3. Configure database add-ons
4. Set up automatic deployments
5. Configure custom domains

## 6. Monitoring and Maintenance

### Setup Monitoring
- [ ] Implement error tracking (e.g., Sentry)
- [ ] Set up performance monitoring
- [ ] Configure uptime monitoring
- [ ] Set up database monitoring
- [ ] Implement logging aggregation

### Regular Maintenance
- [ ] Set up automated backups
- [ ] Configure security updates
- [ ] Implement database maintenance
- [ ] Set up performance optimization
- [ ] Configure regular health checks

## 7. Backup and Recovery

### Database Backup
```bash
# MongoDB backup
mongodump --uri="mongodb://localhost:27017/blnr-ecommerce" --out=/backup

# MongoDB restore
mongorestore --uri="mongodb://localhost:27017/blnr-ecommerce" /backup
```

### File Uploads Backup
```bash
# Backup uploads directory
tar -czf uploads_backup.tar.gz uploads/

# Restore uploads
tar -xzf uploads_backup.tar.gz
```

## 8. Scaling Considerations

### Horizontal Scaling
- [ ] Set up load balancing
- [ ] Configure session management
- [ ] Implement proper caching
- [ ] Set up database replication
- [ ] Configure proper monitoring

### Vertical Scaling
- [ ] Optimize database queries
- [ ] Implement proper indexing
- [ ] Configure memory management
- [ ] Set up proper caching
- [ ] Optimize file storage

## 9. Testing

### Backend Tests
```bash
cd backend
npm run test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

## 10. Documentation

### API Documentation
- [ ] Set up Swagger/OpenAPI
- [ ] Document all endpoints
- [ ] Include request/response examples
- [ ] Document error codes
- [ ] Include authentication details

### User Documentation
- [ ] Create user guides
- [ ] Document features
- [ ] Include troubleshooting
- [ ] Create FAQ
- [ ] Document best practices 