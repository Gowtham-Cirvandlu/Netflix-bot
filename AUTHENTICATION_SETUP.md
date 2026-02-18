# Netflix Bot - Authentication System Setup Guide

## 📋 Overview

This project implements a complete user authentication system with:
- **Frontend**: React + TypeScript with Netflix-style UI
- **Backend**: Express + TypeScript
- **Database**: PostgreSQL hosted on Aiven.io
- **Authentication**: JWT-based with bcrypt password hashing

## 🚀 Part 1: Aiven Database Setup (Manual)

Since Playwright automation may face network issues, please follow these manual steps:

### Step 1: Create Aiven.io Account
1. Go to https://console.aiven.io
2. Sign up or log in with:
   - **Email**: gowthamnaidu979@gmail.com
   - **Password**: Gowtha0987@

### Step 2: Create PostgreSQL Service
1. Navigate to: https://console.aiven.io/account/a595a6228864/project/gowthamnaidu979-d4f5/services
2. Click "Add Service" or "Create Service"
3. Select **PostgreSQL**
4. Configure service:
   - **Service name**: `netflix-bot-db`
   - **Region**: `us-east-1` (or closest to you)
   - **Plan**: Select Free tier if available, otherwise Development/Hobbyist
5. Click "Create Service"
6. Wait 2-3 minutes for service to be ready (status will change to "Running")

### Step 3: Get Connection Details
Once service is running:
1. Click on the `netflix-bot-db` service
2. Go to "Connection Info" tab
3. Copy the following details:
   - **Host** (e.g., `netflix-bot-db-demo-instance.aivencloud.com`)
   - **Port** (usually `13043`)
   - **Database name** (usually `defaultdb`)
   - **Username** (e.g., `avnadmin`)
   - **Password** (click "Generate" if needed)

### Step 4: Download SSL Certificate
1. Go to "SSL" tab in the service
2. Download the **CA certificate**
3. Save it as `server/ca.pem` in your project

### Step 5: Update Environment Variables
Update your `.env` file with the credentials:

```env
# Database (Aiven.io PostgreSQL)
DB_HOST=your-aiven-host.aivencloud.com
DB_PORT=your-port
DB_NAME=defaultdb
DB_USER=your-username
DB_PASSWORD=your-password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=5000
CLIENT_URL=http://localhost:5173

# Frontend API URL
VITE_API_URL=http://localhost:5000/api
```

## 💻 Part 2: Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### 1. Install Dependencies
```bash
npm install
# or
npm install --legacy-peer-deps
```

### 2. Initialize Database
```bash
npm run init-db
```

This will:
- Create the `users` table
- Enable UUID extension
- Add database indexes

### 3. Start Development Server
```bash
npm run dev
```

This runs both:
- Backend API server on http://localhost:5000
- Frontend on http://localhost:5173

## 🔐 Part 3: Authentication Flow

### Registration
1. Navigate to http://localhost:5173/register
2. Fill in the form:
   - Full Name (min 2 chars)
   - Email (valid format)
   - Phone (min 10 digits)
   - Password (min 8 chars)
   - Gender (optional: Male/Female/Other/Prefer not to say)
3. Click "Create Account"
4. User is created in PostgreSQL with hashed password
5. JWT token is generated and stored in localStorage
6. User is redirected to /browse

### Login
1. Navigate to http://localhost:5173/login
2. Enter email and password
3. Backend verifies credentials
4. JWT token is returned
5. User is redirected to intended page (or /browse)

### Protected Routes
- `/browse` - Protected (requires authentication)
- `/search` - Protected (requires authentication)
- `/login` - Public (redirect to /browse if authenticated)
- `/register` - Public (redirect to /browse if authenticated)

## 📁 Project Structure

```
/
├── server/                      # Backend API
│   ├── routes/
│   │   └── auth.ts             # Auth endpoints
│   ├── middleware/
│   │   └── auth.ts             # JWT middleware
│   ├── types/
│   │   └── user.ts             # User types
│   ├── db.ts                   # Database connection
│   ├── index.ts                # Express server
│   └── init-db.ts              # Database initialization
│
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── RegisterForm.tsx
│   │   │   └── LoginForm.tsx
│   │   └── layout/
│   │       ├── NetflixNavbar.tsx
│   │       └── ProtectedRoute.tsx
│   ├── context/
│   │   └── AuthContext.tsx     # Authentication context
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Browse.tsx
│   │   └── Search.tsx
│   ├── types/
│   │   └── user.ts             # Frontend user types
│   └── App.tsx
│
├── .env                        # Environment variables (your secrets)
└── .env.example               # Template for environment variables
```

## 🔒 API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123",
  "gender": "prefer_not_to_say"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "gender": "Prefer not to say",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token"
}
```

#### POST /api/auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "gender": "Prefer not to say",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt-token"
}
```

#### GET /api/auth/me
Get current user (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "gender": "Prefer not to say",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🛠️ Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run init-db` - Initialize database tables
- `npm run lint` - Run ESLint

## 🔍 Testing Checklist

After setup, verify:

- [ ] Database created on Aiven.io
- [ ] CA certificate downloaded to server/ca.pem
- [ ] Environment variables updated in .env
- [ ] npm install completed successfully
- [ ] npm run init-db executed without errors
- [ ] npm run dev starts both servers
- [ ] Registration form works at /register
- [ ] Login form works at /login
- [ ] User is redirected to /browse after auth
- [ ] Protected routes work correctly
- [ ] Logout button works
- [ ] User data appears in navbar dropdown

## 🐛 Troubleshooting

### Database Connection Issues
1. Check environment variables are correct
2. Ensure CA certificate exists at `server/ca.pem`
3. Verify PostgreSQL service is running in Aiven console
4. Check Aiven service status isn't in maintenance

### Build Errors
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install --legacy-peer-deps`
3. Check TypeScript errors with `npm run build`

### Port Conflicts
- Backend default port: 5000
- Frontend default port: 5173
- Change in `.env` file if needed

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Router Documentation](https://reactrouter.com/)
- [PostgreSQL Node.js Driver](https://node-postgres.com/)
- [JSON Web Tokens (JWT)](https://jwt.io/)
- [bcrypt Password Hashing](https://www.npmjs.com/package/bcrypt)
- [Aiven PostgreSQL](https://aiven.io/postgresql)

## 🔐 Security Notes

- Never commit `.env` file with real credentials
- Change `JWT_SECRET` in production
- Use strong passwords (min 8 characters, bcrypt with 12 salt rounds)
- Enable SSL for database connections
- Consider rate limiting for auth endpoints
- Add request validation (already implemented with Zod)

## 📄 License

This project is for educational purposes.