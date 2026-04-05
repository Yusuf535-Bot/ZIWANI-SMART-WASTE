# ZIWANI Smart Waste Management System - Complete Setup Guide

## System Architecture

This system consists of:
- **Frontend**: React app for user interface
- **Backend**: Node.js/Express server with SQLite database
- **Authentication**: JWT-based token authentication with bcrypt password hashing
- **Security**: All sensitive data is encrypted and never stored in plain text

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- SQLite3

## Installation & Setup

### 1. Install Frontend Dependencies

```bash
cd /workspaces/ZIWANI-SMART-WASTE
npm install
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### 3. Environment Configuration

Frontend (.env):
```
REACT_APP_API_URL=http://localhost:5000/api
```

Backend (server/.env):
```
PORT=5000
JWT_SECRET=ziwani_secret_key_2026
NODE_ENV=development
```

## Running the Application

### Option 1: Run both servers with one command

```bash
npm run dev
```

This uses `concurrently` to start both the backend and frontend simultaneously.

### Option 2: Run servers separately

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API: http://localhost:5000/api

## Default Demo Credentials

### User 1 - eco_hero
- **Username**: eco_hero
- **Password**: password123
- **Points**: 45

### User 2 - green_guardian  
- **Username**: green_guardian
- **Password**: demo2024
- **Points**: 78

## Key Features Fixed

### ✅ Security Improvements
1. **Password Hashing**: All passwords are hashed with bcrypt (10 salt rounds)
2. **JWT Authentication**: Secure token-based authentication
3. **No Plain Text Storage**: Passwords never stored in plain text
4. **Database Protection**: SQLite database with proper schema

### ✅ Real Backend API
1. **User Authentication**
   - Login endpoint
   - Signup endpoint
   - Profile update endpoint

2. **Bottle Tracking**
   - Add bottles endpoint
   - Bottle history endpoint
   - Bottle statistics endpoint

3. **Points Redemption**
   - Redeem points endpoint
   - Redemption history endpoint

### ✅ Data Persistence
1. **SQLite Database**: All data persists across sessions
2. **User Accounts**: Proper user management
3. **Transaction History**: Complete audit trail
4. **Points Management**: Accurate point tracking

## API Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/signup
GET /api/auth/me
PUT /api/auth/profile
```

### Bottles
```
POST /api/bottles
GET /api/bottles/history
GET /api/bottles/stats
```

### Redemptions
```
POST /api/redemptions
GET /api/redemptions/history
```

## Database Schema

### Users Table
- id (PRIMARY KEY)
- full_name
- phone_number (UNIQUE)
- location
- age
- preferred_name (UNIQUE)
- password_hash
- total_points
- profile_picture
- join_date
- created_at
- updated_at

### Bottles Table
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- bottle_type
- quantity
- points_earned
- photo_url
- created_at

### Redemptions Table
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- item_name
- points_spent
- category
- created_at

### Sessions Table
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- token
- expires_at
- created_at

## Frontend Structure

```
src/
├── pages/
│   ├── LoginPage.js          # Login & Signup with API
│   ├── DashboardPage.js      # Main dashboard
│   ├── BottleClassificationPage.js  # Add bottles with API
│   ├── RedemptionPage.js     # Redeem points with API
│   ├── ProfilePage.js        # Update profile with API
│   ├── PointsHistoryPage.js  # View history
│   └── ...
├── utils/
│   ├── apiClient.js          # Axios API client with interceptors
│   ├── authUtils.js          # Authentication helpers
│   └── imageAssets.js        # Image URL management
└── App.js                     # Main app component
```

## Backend Structure

```
server/
├── server.js                 # Express app entry point
├── db/
│   └── init.js              # Database initialization & schema
├── middleware/
│   └── auth.js              # JWT middleware & token generation
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── bottles.js           # Bottle tracking endpoints
│   └── redemptions.js       # Points redemption endpoints
└── package.json
```

## Available Scripts

### Frontend
```bash
npm start              # Start development server
npm run build          # Create production build
npm test               # Run tests
npm run eject          # Eject from create-react-app
```

### Backend
```bash
cd server
npm start              # Start server
npm run dev            # Start with nodemon (auto-reload)
```

### Full Stack
```bash
npm run dev            # Run both frontend and backend
npm run server         # Install and start backend
```

## Testing the System

### 1. Test Login
1. Go to http://localhost:3000
2. Use credentials: `eco_hero` / `password123`
3. Verify token is created and stored

### 2. Test Bottle Addition
1. Login successfully
2. Click "Add Bottles" on Dashboard
3. Upload a photo or select bottle type
4. Verify points are added to your account

### 3. Test Points Redemption
1. Click "Redeem Points"
2. Select an item
3. Verify points are deducted from your account

### 4. Test Profile Update
1. Click on profile picture
2. Update your preferred name or avatar
3. Verify changes persist after reload

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is already in use
lsof -i :5000

# If in use, kill the process
kill -9 <PID>
```

### Frontend can't connect to backend
1. Ensure backend is running on port 5000
2. Check `.env` file has correct API URL
3. Check CORS is enabled in backend

### Database errors
```bash
# Reset database
rm server/ziwani.db
npm run dev  # This will recreate it
```

## Production Deployment

Before deploying to production:

1. Change JWT_SECRET to a strong random string
2. Set NODE_ENV=production
3. Use a proper database (PostgreSQL recommended)
4. Enable HTTPS
5. Set proper CORS origin
6. Use environment-specific .env files
7. Add rate limiting
8. Add request validation
9. Add error logging
10. Add monitoring and alerts

## Security Checklist

- ✅ Passwords hashed with bcrypt
- ✅ JWT token-based authentication
- ✅ CORS protection
- ✅ Input validation
- ✅ No plain text passwords
- ✅ Secure token expiration
- ✅ Token refresh mechanism
- ⚠️ TODO: Add HTTPS enforcement
- ⚠️ TODO: Add rate limiting
- ⚠️ TODO: Add request logging

## License

This project is part of the ZIWANI Smart Waste Management initiative in Kisumu.
