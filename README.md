# 📚 BookMania - Books Scraper

A full-stack web application that scrapes book data from World of Books and provides a beautiful interface for browsing and discovering books. Built with NestJS (backend) and Next.js (frontend).

![Tech Stack](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture Overview](#-architecture-overview)
- [Tech Stack](#-tech-stack)
- [Design Decisions](#-design-decisions)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### Backend
- 🔄 **Web Scraping**: Automated scraping from World of Books using Playwright/Crawlee
- 📊 **Data Management**: PostgreSQL database with TypeORM for structured data storage
- 🚀 **Job Queue**: Bull queue with Redis for asynchronous scraping tasks
- 🔍 **Advanced Filtering**: Search, category, price range, author, and rating filters
- 📄 **Pagination**: Efficient data retrieval with pagination support
- 🛡️ **Rate Limiting**: Throttler guard to prevent API abuse
- 📝 **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- ♻️ **Data Refresh**: On-demand product data refresh from source

### Frontend
- 🎨 **Beautiful UI**: Vintage book-themed design with amber/yellow aesthetic
- ⚡ **TanStack Query**: Efficient data fetching with caching and background updates
- 🔎 **Smart Search**: Debounced search to prevent rate limit issues
- 🎯 **Advanced Filters**: Category, price range, author filtering
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- 🔄 **Optimistic Updates**: Smooth pagination without loading flashes
- 📖 **Book Details**: Comprehensive product pages with specifications
- 🌐 **Navigation**: About and Contact pages with social links

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Next.js 16 (React 19) + TypeScript + Tailwind CSS    │ │
│  │  - TanStack Query for data fetching                   │ │
│  │  - Axios for HTTP requests                            │ │
│  │  - React Hot Toast for notifications                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              NestJS API Server                         │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Controllers (REST Endpoints)                    │ │ │
│  │  │  - ProductController                             │ │ │
│  │  │  - CategoryController                            │ │ │
│  │  │  - ScraperController                             │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Services (Business Logic)                       │ │ │
│  │  │  - ProductService                                │ │ │
│  │  │  - ScraperService (Playwright/Crawlee)           │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Bull Queue Processor                            │ │ │
│  │  │  - ScraperProcessor (Async Jobs)                 │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
          ↓                    ↓                    ↓
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   PostgreSQL     │  │      Redis       │  │  World of Books  │
│   (Database)     │  │   (Job Queue)    │  │   (Web Scraping) │
│                  │  │                  │  │                  │
│  - Products      │  │  - Scrape Jobs   │  │  - Product Data  │
│  - Categories    │  │  - Queue Status  │  │  - Images        │
│  - Reviews       │  │                  │  │  - Prices        │
│  - Navigation    │  │                  │  │  - Reviews       │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

### Data Flow

1. **User Request** → Frontend sends request to backend API
2. **API Processing** → NestJS controller validates and routes request
3. **Service Layer** → Business logic processes the request
4. **Database Query** → TypeORM fetches data from PostgreSQL
5. **Response** → Data sent back to frontend with proper formatting
6. **Caching** → TanStack Query caches response for 5 minutes

### Scraping Flow

1. **Trigger** → User or scheduler triggers scrape job
2. **Queue Job** → ScraperController queues job in Bull/Redis
3. **Process** → ScraperProcessor picks up job asynchronously
4. **Scrape** → Playwright/Crawlee navigates and extracts data
5. **Store** → Data saved to PostgreSQL via TypeORM
6. **Complete** → Job marked as completed in queue

---

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS 11
- **Language**: TypeScript 5.9
- **Database**: PostgreSQL (with TypeORM 0.3)
- **Queue**: Bull 4.16 + Redis (ioredis 5.9)
- **Web Scraping**: Playwright 1.57 + Crawlee 3.15
- **Validation**: class-validator + class-transformer
- **API Docs**: Swagger/OpenAPI (@nestjs/swagger)
- **Rate Limiting**: @nestjs/throttler

### Frontend
- **Framework**: Next.js 16.1 (App Router)
- **UI Library**: React 19.2
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Data Fetching**: TanStack Query 5.90
- **HTTP Client**: Axios 1.13
- **Icons**: Lucide React 0.562
- **Notifications**: React Hot Toast 2.6

### Infrastructure
- **Database**: PostgreSQL 16+
- **Cache/Queue**: Redis 7+ (Upstash compatible)
- **Container**: Docker + Docker Compose
- **Deployment**: Vercel (Frontend) + Railway/Render (Backend)

---

## 🎯 Design Decisions

### 1. **Monorepo Structure**
- **Why**: Easier code sharing, unified versioning, and simplified deployment
- **Structure**: Separate `backend/` and `frontend/` directories with independent package.json files

### 2. **NestJS for Backend**
- **Why**: Enterprise-grade architecture, built-in dependency injection, excellent TypeScript support
- **Benefits**: Modular design, testability, scalability, and extensive ecosystem

### 3. **Next.js App Router**
- **Why**: Modern React patterns, server components, improved performance
- **Benefits**: File-based routing, built-in optimization, SEO-friendly

### 4. **TanStack Query**
- **Why**: Superior caching, background updates, optimistic UI
- **Benefits**: Reduced API calls, better UX, automatic refetching, placeholder data for pagination

### 5. **Bull Queue + Redis**
- **Why**: Scraping is time-consuming and should be asynchronous
- **Benefits**: Non-blocking API, job retry logic, progress tracking, distributed processing

### 6. **Playwright/Crawlee**
- **Why**: Modern web scraping with JavaScript rendering support
- **Benefits**: Handles dynamic content, screenshot debugging, retry logic, rate limiting

### 7. **TypeORM**
- **Why**: Type-safe database queries, migrations, relations
- **Benefits**: Auto-generated types, query builder, transaction support

### 8. **Debounced Search**
- **Why**: Prevent rate limit (429) errors on text input
- **Benefits**: Reduced API calls, better server performance, improved UX

### 9. **UUID Primary Keys**
- **Why**: Better for distributed systems, no sequential ID leakage
- **Benefits**: Security, scalability, easier data migration

### 10. **Vintage Book Theme**
- **Why**: Unique, memorable design that reflects the book domain
- **Benefits**: Brand identity, aesthetic appeal, user engagement

---

## 📁 Project Structure

```
Books Scraper/
├── backend/                      # NestJS Backend
│   ├── src/
│   │   ├── config/               # Configuration files
│   │   │   ├── database.config.ts
│   │   │   └── redis.config.ts
│   │   ├── modules/
│   │   │   ├── product/          # Product module
│   │   │   │   ├── dto/          # Data Transfer Objects
│   │   │   │   ├── product.controller.ts
│   │   │   │   ├── product.service.ts
│   │   │   │   └── product.module.ts
│   │   │   ├── category/         # Category module
│   │   │   ├── navigation/       # Navigation module
│   │   │   │   └── entities/     # TypeORM entities
│   │   │   └── scraper/          # Scraper module
│   │   │       ├── scraper.controller.ts
│   │   │       ├── scraper.service.ts
│   │   │       ├── scraper.processor.ts
│   │   │       └── scraper.module.ts
│   │   ├── app.module.ts         # Root module
│   │   └── main.ts               # Application entry
│   ├── storage/                  # Crawlee storage
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                     # Next.js Frontend
│   ├── app/
│   │   ├── components/           # Reusable components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ...
│   │   ├── pages/                # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── BooksPage.tsx
│   │   │   └── BookDetailPage.tsx
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useProducts.ts
│   │   │   └── useCategories.ts
│   │   ├── lib/                  # Utilities
│   │   │   ├── api.ts            # Axios instance
│   │   │   └── types.ts          # TypeScript types
│   │   ├── about/                # About page
│   │   ├── contact/              # Contact page
│   │   ├── books/                # Books pages
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml            # Docker services
├── seed-database.sh              # Database seeding script
└── README.md                     # This file
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20.x or higher ([Download](https://nodejs.org/))
- **npm**: v10.x or higher (comes with Node.js)
- **PostgreSQL**: v16.x or higher ([Download](https://www.postgresql.org/download/))
- **Redis**: v7.x or higher ([Download](https://redis.io/download)) or use [Upstash](https://upstash.com/)
- **Git**: For cloning the repository

### Optional
- **Docker**: For containerized deployment ([Download](https://www.docker.com/))
- **Docker Compose**: For multi-container orchestration

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/books-scraper.git
cd books-scraper
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install --legacy-peer-deps
```

> **Note**: We use `--legacy-peer-deps` to handle peer dependency conflicts between NestJS packages and other dependencies.

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install --legacy-peer-deps
```

> **Note**: Required for compatibility between React 19, Next.js 16, and TanStack Query 5.

### 4. Install Playwright Browsers (Backend)

```bash
cd ../backend
npx playwright install
```

This downloads Chromium, Firefox, and WebKit browsers needed for scraping.

---

## ⚙️ Configuration

### Backend Configuration

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=8000
NODE_ENV=development

# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=books_scraper

# Redis (Local or Upstash)
# Option 1: Local Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Option 2: Upstash Redis (recommended for production)
REDIS_URL=rediss://default:your_password@your-redis.upstash.io:6379

# Scraper
SCRAPER_TIMEOUT=120000
SCRAPER_MAX_CONCURRENCY=1

# API
API_PREFIX=api/v1
THROTTLE_TTL=60
THROTTLE_LIMIT=10
```

### Frontend Configuration

Create a `.env.local` file in the `frontend/` directory:

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Database Setup

1. **Create Database**:
```bash
psql -U postgres
CREATE DATABASE books_scraper;
\q
```

2. **Run Migrations** (if applicable):
```bash
cd backend
npm run migration:run
```

> **Note**: TypeORM will auto-create tables on first run if `synchronize: true` is set in database config.

### Redis Setup

**Option 1: Local Redis**
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Windows
# Download from https://github.com/microsoftarchive/redis/releases
```

**Option 2: Upstash (Recommended for Production)**
1. Sign up at [upstash.com](https://upstash.com/)
2. Create a Redis database
3. Copy the `REDIS_URL` to your `.env` file

---

## 🏃 Running the Application

### Development Mode

#### 1. Start Backend
```bash
cd backend
npm run start:dev
```
Backend will run on `http://localhost:8000`

#### 2. Start Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

### Production Mode

#### Backend
```bash
cd backend
npm run build
npm run start:prod
```

#### Frontend
```bash
cd frontend
npm run build
npm run start
```

### Using Docker Compose

```bash
# Start all services (PostgreSQL, Redis, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

---

## 📖 API Documentation

Once the backend is running, access the Swagger documentation at:

```
http://localhost:8000/api/docs
```

### Key Endpoints

#### Products
- `GET /api/v1/products` - List products with filters
- `GET /api/v1/products/:id` - Get product by ID
- `POST /api/v1/products/:id/refresh` - Refresh product data

#### Categories
- `GET /api/v1/categories` - List all categories
- `GET /api/v1/categories/:id` - Get category by ID

#### Scraper
- `POST /api/v1/scraper/seed` - Seed database with homepage products
- `POST /api/v1/scraper/homepage` - Scrape homepage products
- `POST /api/v1/scraper/category?url=...` - Scrape category
- `POST /api/v1/scraper/product?url=...` - Scrape product details

### Example Requests

```bash
# Get products with filters
curl "http://localhost:8000/api/v1/products?page=1&limit=20&search=Harry&minPrice=5&maxPrice=20"

# Seed database
curl -X POST http://localhost:8000/api/v1/scraper/seed

# Refresh product
curl -X POST http://localhost:8000/api/v1/products/{uuid}/refresh
```

---

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
cd frontend
vercel
```

3. **Set Environment Variables** in Vercel Dashboard:
```
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

4. **Production Deployment**:
```bash
vercel --prod
```

### Backend Deployment (Railway)

1. **Install Railway CLI**:
```bash
npm install -g @railway/cli
```

2. **Login**:
```bash
railway login
```

3. **Initialize Project**:
```bash
cd backend
railway init
```

4. **Add PostgreSQL**:
```bash
railway add postgresql
```

5. **Add Redis** (or use Upstash):
```bash
railway add redis
```

6. **Set Environment Variables**:
```bash
railway variables set PORT=8000
railway variables set NODE_ENV=production
# Add all other variables from .env
```

7. **Deploy**:
```bash
railway up
```

### Backend Deployment (Render)

1. **Create `render.yaml`** in backend directory:
```yaml
services:
  - type: web
    name: books-scraper-backend
    env: node
    buildCommand: npm install --legacy-peer-deps && npm run build
    startCommand: npm run start:prod
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 8000
      - key: DATABASE_URL
        fromDatabase:
          name: books-scraper-db
          property: connectionString
      - key: REDIS_URL
        fromService:
          name: books-scraper-redis
          type: redis
          property: connectionString

databases:
  - name: books-scraper-db
    databaseName: books_scraper
    user: postgres

  - name: books-scraper-redis
    plan: starter
```

2. **Push to GitHub** and connect to Render

3. **Deploy** via Render Dashboard

### Docker Deployment

1. **Build Images**:
```bash
docker-compose build
```

2. **Push to Registry**:
```bash
docker tag books-scraper-backend your-registry/books-scraper-backend
docker push your-registry/books-scraper-backend

docker tag books-scraper-frontend your-registry/books-scraper-frontend
docker push your-registry/books-scraper-frontend
```

3. **Deploy to Cloud** (AWS ECS, Google Cloud Run, Azure Container Instances)

---

## 🐛 Troubleshooting

### Common Issues

#### 1. **Peer Dependency Conflicts**
```bash
# Solution: Use --legacy-peer-deps flag
npm install --legacy-peer-deps
```

#### 2. **Port Already in Use**
```bash
# Backend (port 8000)
lsof -ti:8000 | xargs kill -9

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9
```

#### 3. **Database Connection Error**
- Verify PostgreSQL is running: `pg_isready`
- Check credentials in `.env`
- Ensure database exists: `psql -U postgres -l`

#### 4. **Redis Connection Error**
- Verify Redis is running: `redis-cli ping` (should return `PONG`)
- Check REDIS_URL format for Upstash
- Test connection: `npm run test:redis` (in backend)

#### 5. **Playwright Browser Not Found**
```bash
cd backend
npx playwright install
```

#### 6. **429 Rate Limit Error**
- Debouncing is implemented for search/author filters
- Wait 500ms between requests
- Check THROTTLE_LIMIT in backend `.env`

#### 7. **CORS Issues**
- Ensure `NEXT_PUBLIC_BACKEND_URL` is correctly set
- Check backend CORS configuration in `main.ts`

#### 8. **TypeScript Errors**
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

#### 9. **Scraping Timeout**
- Increase `SCRAPER_TIMEOUT` in `.env`
- Check internet connection
- Verify World of Books website is accessible

#### 10. **Environment Variables Not Loading**
- Restart development server after changing `.env`
- For frontend, variables must start with `NEXT_PUBLIC_`
- Check `.env` file is in correct directory

---

## 📝 Scripts

### Backend Scripts
```bash
npm run start:dev      # Start development server
npm run start:prod     # Start production server
npm run build          # Build for production
npm run test           # Run tests
npm run test:redis     # Test Redis connection
npm run lint           # Lint code
npm run format         # Format code with Prettier
```

### Frontend Scripts
```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run start          # Start production server
npm run lint           # Lint code
```

### Database Seeding
```bash
# From project root
./seed-database.sh

# Or manually
curl -X POST http://localhost:8000/api/v1/scraper/seed
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Zivanika** - [GitHub](https://github.com/Zivanika) | [LinkedIn](https://www.linkedin.com/in/harshita-barnwal-17a732234/)

---

## 🙏 Acknowledgments

- [World of Books](https://www.worldofbooks.com) - Data source
- [NestJS](https://nestjs.com/) - Backend framework
- [Next.js](https://nextjs.org/) - Frontend framework
- [Playwright](https://playwright.dev/) - Web scraping
- [TanStack Query](https://tanstack.com/query) - Data fetching

---

## 📞 Support

For support, email harshitabarnwal2003@gmail.com or open an issue on GitHub.

---

**Made with ❤️ for book lovers**
