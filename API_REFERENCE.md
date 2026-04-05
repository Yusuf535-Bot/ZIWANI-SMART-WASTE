# ZIWANI API Reference Guide

This guide provides all API endpoints, authentication methods, and usage examples.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <JWT_TOKEN>
```

How to get a token:
1. Call `/auth/login` endpoint
2. Copy the `token` from response
3. Add it to Authorization header for all subsequent requests

## API Endpoints

### Authentication Endpoints

#### 1. Login User
```
POST /auth/login
Content-Type: application/json

Request:
{
  "preferredName": "eco_hero",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "demo1",
    "fullName": "John Kipchoge",
    "phoneNumber": "+254722123456",
    "location": "Kisumu Central",
    "age": 28,
    "preferredName": "eco_hero",
    "totalPoints": 45,
    "profilePicture": "https://api.dicebear.com/...",
    "joinDate": "2025-01-15T00:00:00.000Z",
    "isFirstTime": false
  }
}

Error (401):
{
  "success": false,
  "error": "Incorrect username"
}
```

#### 2. Create New User (Signup)
```
POST /auth/signup
Content-Type: application/json

Request:
{
  "fullName": "Jane Doe",
  "phoneNumber": "+254700123456",
  "location": "Kisumu West",
  "age": 25,
  "preferredName": "eco_warrior",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}

Response (201):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_abc123def",
    "fullName": "Jane Doe",
    "phoneNumber": "+254700123456",
    "location": "Kisumu West",
    "age": 25,
    "preferredName": "eco_warrior",
    "totalPoints": 0,
    "profilePicture": "https://api.dicebear.com/...",
    "joinDate": "2026-04-05T18:00:00.000Z",
    "isFirstTime": true
  }
}

Error Scenarios:
- Username already exists: 400
- Phone number already exists: 400
- Age less than 8: 400
- Passwords don't match: 400
- Password less than 6 characters: 400
```

#### 3. Get Current User
```
GET /auth/me
Authorization: Bearer <TOKEN>

Response (200):
{
  "success": true,
  "user": {
    "id": "demo1",
    "fullName": "John Kipchoge",
    "phoneNumber": "+254722123456",
    "location": "Kisumu Central",
    "age": 28,
    "preferredName": "eco_hero",
    "totalPoints": 48,
    "profilePicture": "https://api.dicebear.com/...",
    "joinDate": "2025-01-15T00:00:00.000Z",
    "isFirstTime": false
  }
}

Error (401):
{
  "success": false,
  "error": "Invalid or expired token"
}
```

#### 4. Update Profile
```
PUT /auth/profile
Authorization: Bearer <TOKEN>
Content-Type: application/json

Request:
{
  "preferredName": "eco_hero_v2",
  "profilePicture": "data:image/png;base64,..." (optional)
}

Response (200):
{
  "success": true,
  "user": {
    "id": "demo1",
    "fullName": "John Kipchoge",
    "phoneNumber": "+254722123456",
    "location": "Kisumu Central",
    "age": 28,
    "preferredName": "eco_hero_v2",
    "totalPoints": 48,
    "profilePicture": "https://api.dicebear.com/...",
    "joinDate": "2025-01-15T00:00:00.000Z",
    "isFirstTime": false
  }
}

Error (400):
{
  "success": false,
  "error": "Username already taken"
}
```

---

### Bottle Endpoints

#### 1. Add Bottles
```
POST /bottles
Authorization: Bearer <TOKEN>
Content-Type: application/json

Request:
{
  "bottleType": "Drinking Water",
  "quantity": 3,
  "photoUrl": "data:image/png;base64,..." (optional)
}

Response (201):
{
  "success": true,
  "message": "Successfully added 3 bottle(s)! You earned 3 point(s)",
  "pointsEarned": 3,
  "totalPoints": 51,
  "bottle": {
    "id": "bottle_21e0cb3c033e",
    "bottleType": "Drinking Water",
    "quantity": 3,
    "pointsEarned": 3,
    "createdAt": "2026-04-05T18:05:13.231Z"
  }
}

Valid Bottle Types:
- "Drinking Water"
- "Soda Water"
- "Beer Bottle"
- "Wine Bottle"
- "Other"

Error (400):
{
  "success": false,
  "error": "Quantity must be at least 1"
}
```

#### 2. Get Bottle History
```
GET /bottles/history
Authorization: Bearer <TOKEN>

Response (200):
{
  "success": true,
  "bottleHistory": [
    {
      "id": "bottle_21e0cb3c033e",
      "bottleType": "Drinking Water",
      "quantity": 3,
      "pointsEarned": 3,
      "photoUrl": null,
      "createdAt": "2026-04-05T18:05:13.231Z"
    },
    {
      "id": "bottle_18d2f1a2b0c5",
      "bottleType": "Soda Water",
      "quantity": 2,
      "pointsEarned": 2,
      "photoUrl": null,
      "createdAt": "2026-04-05T17:30:00.000Z"
    }
  ]
}
```

#### 3. Get Bottle Statistics
```
GET /bottles/stats
Authorization: Bearer <TOKEN>

Response (200):
{
  "success": true,
  "stats": {
    "totalBottles": 5,
    "totalQuantity": 5,
    "totalPointsEarned": 5
  }
}
```

---

### Redemption Endpoints

#### 1. Redeem Points
```
POST /redemptions
Authorization: Bearer <TOKEN>
Content-Type: application/json

Request:
{
  "itemName": "Bread Pack",
  "points": 10,
  "category": "food"
}

Valid Categories:
- "food"
- "dignity"
- "skills"

Response (201):
{
  "success": true,
  "message": "Congratulations! You redeemed \"Bread Pack\" for 10 points!",
  "redemption": {
    "id": "redemption_abc123def",
    "itemName": "Bread Pack",
    "pointsSpent": 10,
    "category": "food",
    "createdAt": "2026-04-05T18:10:00.000Z"
  },
  "totalPoints": 41
}

Error (400):
{
  "success": false,
  "error": "Insufficient points. You have 5 points but need 10."
}
```

#### 2. Get Redemption History
```
GET /redemptions/history
Authorization: Bearer <TOKEN>

Response (200):
{
  "success": true,
  "redemptionHistory": [
    {
      "id": "redemption_abc123def",
      "itemName": "Bread Pack",
      "pointsSpent": 10,
      "category": "food",
      "createdAt": "2026-04-05T18:10:00.000Z"
    },
    {
      "id": "redemption_xyz789abc",
      "itemName": "T-Shirt",
      "pointsSpent": 15,
      "category": "dignity",
      "createdAt": "2026-04-04T14:30:00.000Z"
    }
  ]
}
```

---

## Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input/validation error |
| 401 | Unauthorized - Token missing or invalid |
| 404 | Not Found - Endpoint/resource not found |
| 500 | Internal Server Error - Server error |

---

## JavaScript/Frontend Examples

### Using the ApiClient

```javascript
import { authAPI, bottleAPI, redemptionAPI } from '../utils/apiClient';

// Login
const loginResult = await authAPI.login('eco_hero', 'password123');
if (loginResult.success) {
  console.log('Login successful!');
  console.log('Token:', loginResult.token);
}

// Add bottle
const bottleResult = await bottleAPI.addBottle({
  bottleType: 'Drinking Water',
  quantity: 5
});
if (bottleResult.success) {
  console.log('Points earned:', bottleResult.pointsEarned);
}

// Redeem points
const redeemResult = await redemptionAPI.redeem({
  itemName: 'Bread Pack',
  points: 10,
  category: 'food'
});
if (redeemResult.success) {
  console.log('Redemption successful!');
}
```

### Using Curl

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"preferredName":"eco_hero","password":"password123"}'

# Add bottle
curl -X POST http://localhost:5000/api/bottles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"bottleType":"Drinking Water","quantity":3}'

# Get bottle history
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/bottles/history
```

---

## Token Expiration & Refresh

- Tokens expire after **7 days**
- When a token expires, the API returns **401 Unauthorized**
- Frontend automatically logs out and redirects to login
- New login required to get a fresh token

---

## Rate Limiting (Future Implementation)

Currently not implemented, but recommended for production:
- Add rate limiting middleware
- Recommended: 100 requests per minute per IP
- Stricter limits for login endpoint (5 per minute)

---

## Notes

1. All timestamps are in ISO 8601 format (UTC)
2. All monetary values are in integer points (not cents)
3. Phone numbers should include country code
4. User IDs are randomly generated UUIDs
5. Passwords must be at least 6 characters
6. Age must be between 8 and 120

---

## Support

For API issues, check:
1. Backend is running on port 5000
2. Token is valid and not expired
3. Request headers include `Content-Type: application/json`
4. Request body is valid JSON
5. Authorization header format: `Bearer <TOKEN>`
