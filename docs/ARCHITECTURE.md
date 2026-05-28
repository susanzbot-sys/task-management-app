# Task Management App - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Users                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTPS/TLS
                         │
    ┌────────────────────┴────────────────────┐
    │                                         │
┌───▼──────────────────┐          ┌──────────▼────────────┐
│   Frontend (SPA)     │          │  API Gateway / ALB    │
│  - React App         │          │  - SSL Termination    │
│  - Static Assets     │          │  - Rate Limiting      │
│  - JWT in Cookie     │          │  - Load Balancing     │
└─────────────────────┘           └──────────┬────────────┘
                                             │
                              ┌──────────────┴──────────────┐
                              │                             │
                    ┌─────────▼──────────┐      ┌──────────▼──────────┐
                    │   Backend Service  │      │  Backend Service    │
                    │  - Node.js/Express │      │  - Node.js/Express  │
                    │  - JWT Validation  │      │  - JWT Validation   │
                    │  - Business Logic  │      │  - Business Logic   │
                    │  - DB Queries      │      │  - DB Queries       │
                    └──────────┬──────────┘      └──────────┬──────────┘
                               │                            │
                               └────────────┬───────────────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    │                       │                       │
            ┌───────▼────────┐     ┌───────▼────────┐      ┌───────▼────────┐
            │  PostgreSQL    │     │  Redis Cache   │      │  S3 Bucket     │
            │  - User Data   │     │  - Sessions    │      │  - Files       │
            │  - Tasks       │     │  - Cache       │      │  - Backups     │
            │  - Audit Logs  │     │                │      │                │
            └────────────────┘     └────────────────┘      └────────────────┘
```

## Data Flow

### 1. Authentication Flow

```
User → Register/Login → Hash Password → Store in DB → Generate JWT
                                              ↓
                                        Return Tokens
                                              ↓
                              Frontend stores in HTTP-only cookie
                                              ↓
                        Subsequent requests include JWT in header
```

### 2. Task Operations Flow

```
Frontend Request → API Gateway → Authentication Middleware
                                        ↓
                              Validate JWT Token
                                        ↓
                        Extract user_id from token
                                        ↓
                    Input Validation & Rate Limiting
                                        ↓
                        Database Query (filtered by user_id)
                                        ↓
                    Authorization Check (owns resource?)
                                        ↓
                        Execute Query → Return Response
                                        ↓
                              Frontend Updates UI
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  username VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL FOREIGN KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  status VARCHAR (TODO, IN_PROGRESS, COMPLETED),
  priority VARCHAR (LOW, MEDIUM, HIGH),
  due_date TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  -- Indexes for performance
  INDEX(user_id, status),
  INDEX(user_id, due_date),
  INDEX(user_id, created_at)
);
```

### Refresh Tokens Table
```sql
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY,
  user_id UUID FOREIGN KEY,
  token_hash VARCHAR UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP,
  is_revoked BOOLEAN,
  created_at TIMESTAMP
);
```

### Audit Logs Table
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID FOREIGN KEY,
  action VARCHAR NOT NULL,
  resource_type VARCHAR,
  resource_id VARCHAR,
  changes JSONB,
  ip_address VARCHAR,
  user_agent TEXT,
  created_at TIMESTAMP
);
```

## API Endpoints

### Authentication
```
POST   /api/auth/register        - Register new user
POST   /api/auth/login           - Login user
POST   /api/auth/refresh         - Refresh access token
POST   /api/auth/logout          - Logout user
```

### Tasks
```
GET    /api/tasks                - List user's tasks (with filtering)
GET    /api/tasks/:id            - Get single task
POST   /api/tasks                - Create new task
PATCH  /api/tasks/:id            - Update task
DELETE /api/tasks/:id            - Delete task
```

### Users
```
GET    /api/users/profile        - Get user profile
PATCH  /api/users/profile        - Update profile
POST   /api/users/change-password - Change password
```

### Health
```
GET    /api/health               - Health check endpoint
```

## Security Layers

```
┌──────────────────────────────────┐
│   Security Headers (HSTS, CSP)   │
├──────────────────────────────────┤
│   TLS/HTTPS Encryption           │
├──────────────────────────────────┤
│   CORS Protection                │
├──────────────────────────────────┤
│   Rate Limiting                  │
├─────────────────────────��────────┤
│   Input Validation               │
├──────────────────────────────────┤
│   JWT Authentication             │
├──────────────────────────────────┤
│   Authorization (user_id checks) │
├──────────────────────────────────┤
│   SQL Injection Prevention        │
│   (Parameterized Queries)        │
├──────────────────────────────────┤
│   XSS Prevention                 │
│   (Output Encoding)              │
├──────────────────────────────────┤
│   CSRF Protection                │
├──────────────────────────────────┤
│   Audit Logging                  │
└──────────────────────────────────┘
```

## Deployment Architecture

### Local Development
- Docker Compose for easy setup
- PostgreSQL + Redis locally
- Hot reload for development

### Staging
- AWS ECS Fargate cluster
- RDS Aurora PostgreSQL
- ElastiCache Redis
- CloudWatch monitoring

### Production
- Multi-AZ deployment
- Auto-scaling groups
- Database read replicas
- CDN for static assets
- DDoS protection

## Performance Optimizations

1. **Caching Strategy**
   - Redis cache for frequently accessed data
   - Browser cache for static assets
   - Database query result caching

2. **Database Optimization**
   - Indexed columns for common queries
   - Connection pooling
   - Query optimization

3. **Frontend Optimization**
   - Code splitting
   - Lazy loading
   - Asset compression (gzip)
   - CDN distribution

4. **Backend Optimization**
   - Request compression
   - API response caching
   - Database connection pooling
   - Async operations

## Scalability

### Horizontal Scaling
- Load balancer distributes traffic
- Multiple backend instances
- Stateless API design
- Session stored in Redis (shared)

### Vertical Scaling
- Larger instance types
- More CPU/Memory
- Database optimization

### Database Scaling
- Read replicas for read-heavy workloads
- Sharding for very large datasets
- Connection pooling

## Monitoring & Observability

### Metrics
- API response time
- Request rate
- Error rate
- Database performance
- System resources (CPU, Memory, Disk)

### Logs
- Application logs
- Request logs
- Database logs
- Audit logs

### Alerts
- High error rate
- Slow response times
- Database issues
- Resource exhaustion

## Disaster Recovery

### Backups
- Automated daily database backups
- Point-in-time recovery
- Multi-region backup replication

### Redundancy
- Multi-AZ deployment
- Database replication
- Load balancer failover

### RTO/RPO
- **RTO** (Recovery Time Objective): < 30 minutes
- **RPO** (Recovery Point Objective): < 1 hour

---

See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions.
