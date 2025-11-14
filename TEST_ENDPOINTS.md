# Testing Authentication Endpoints

This guide shows how to test all authentication endpoints using curl commands.

## Prerequisites

1. Make sure the Flask server is running:
   ```bash
   cd backend
   python app.py
   ```
   Or with virtual environment:
   ```bash
   venv\Scripts\activate
   cd backend
   python app.py
   ```

2. The server should be running on `http://localhost:5000`

## Endpoints to Test

### 1. Register User (POST /api/auth/register)

**Windows PowerShell:**
```powershell
Invoke-WebRequest -Uri http://localhost:5000/api/auth/register -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"test@example.com","password":"test123","first_name":"Test","last_name":"User"}' | Select-Object -ExpandProperty Content
```

**Windows CMD (using curl.exe):**
```cmd
curl.exe -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"test123\",\"first_name\":\"Test\",\"last_name\":\"User\"}"
```

**Linux/Mac:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","first_name":"Test","last_name":"User"}'
```

**Expected Response:**
- Success (201): `{"message": "User registered"}`
- Error (400): `{"error": "Email already exists"}`

---

### 2. Login (POST /api/auth/login)

**Windows PowerShell:**
```powershell
$response = Invoke-WebRequest -Uri http://localhost:5000/api/auth/login -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"test@example.com","password":"test123"}'
$response.Content
$token = ($response.Content | ConvertFrom-Json).token
$token
```

**Windows CMD (using curl.exe):**
```cmd
curl.exe -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"test123\"}"
```

**Linux/Mac:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Expected Response:**
- Success (200): `{"token": "eyJ0eXAiOiJKV1QiLCJhbGc..."}`
- Error (401): `{"error": "Invalid credentials"}`

**Save the token** from the response for the next two endpoints!

---

### 3. Get Current User (GET /api/auth/me)

**Windows PowerShell:**
```powershell
$token = "YOUR_TOKEN_HERE"  # Replace with token from login
Invoke-WebRequest -Uri http://localhost:5000/api/auth/me -Method GET -Headers @{"Authorization"="Bearer $token"} | Select-Object -ExpandProperty Content
```

**Windows CMD (using curl.exe):**
```cmd
curl.exe -X GET http://localhost:5000/api/auth/me -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Linux/Mac:**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
- Success (200): `{"customer_id": 1, "role": "user"}`
- Error (401): `{"msg": "Missing Authorization Header"}`

---

### 4. Admin Test (GET /api/auth/admin-test)

**Windows PowerShell:**
```powershell
$token = "YOUR_TOKEN_HERE"  # Replace with token from login
Invoke-WebRequest -Uri http://localhost:5000/api/auth/admin-test -Method GET -Headers @{"Authorization"="Bearer $token"} | Select-Object -ExpandProperty Content
```

**Windows CMD (using curl.exe):**
```cmd
curl.exe -X GET http://localhost:5000/api/auth/admin-test -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Linux/Mac:**
```bash
curl -X GET http://localhost:5000/api/auth/admin-test \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
- Success (200): `{"message": "You are an admin", "user": {...}}`
- Error (403): `{"error": "Admin only"}` (if user is not admin)
- Error (401): `{"msg": "Missing Authorization Header"}` (if no token)

---

## Using the Python Test Script

Alternatively, you can use the provided test script:

```bash
python test_auth_endpoints.py
```

This will test all endpoints automatically.

---

## Troubleshooting

1. **Server not running**: Make sure the Flask app is running on port 5000
2. **Database connection error**: Check your `.env` file has correct database credentials
3. **401 Unauthorized**: Make sure you're including the token in the Authorization header
4. **403 Forbidden on admin-test**: This is expected if the user is not an admin. To test admin functionality, you need to create a user with `role="admin"` in the database.

