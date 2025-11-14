# PowerShell script to test authentication endpoints
# Make sure the Flask server is running on http://localhost:5000

$baseUrl = "http://localhost:5000"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Testing Authentication Endpoints" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Test 1: Register
Write-Host "`n[1] Testing POST /api/auth/register" -ForegroundColor Yellow
$registerBody = @{
    email = "test@example.com"
    password = "test123"
    first_name = "Test"
    last_name = "User"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body $registerBody -ErrorAction Stop
    Write-Host "Status: $($registerResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($registerResponse.Content)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}

# Test 2: Login
Write-Host "`n[2] Testing POST /api/auth/login" -ForegroundColor Yellow
$loginBody = @{
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body $loginBody -ErrorAction Stop
    Write-Host "Status: $($loginResponse.StatusCode)" -ForegroundColor Green
    $loginData = $loginResponse.Content | ConvertFrom-Json
    Write-Host "Response: $($loginResponse.Content)" -ForegroundColor Green
    $token = $loginData.token
    Write-Host "Token received: $($token.Substring(0, [Math]::Min(50, $token.Length)))..." -ForegroundColor Cyan
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
    $token = $null
}

# Test 3: /me endpoint
if ($token) {
    Write-Host "`n[3] Testing GET /api/auth/me" -ForegroundColor Yellow
    try {
        $meResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/me" -Method GET -Headers @{"Authorization"="Bearer $token"} -ErrorAction Stop
        Write-Host "Status: $($meResponse.StatusCode)" -ForegroundColor Green
        Write-Host "Response: $($meResponse.Content)" -ForegroundColor Green
    } catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response: $responseBody" -ForegroundColor Red
        }
    }
} else {
    Write-Host "`n[3] Skipping /api/auth/me - No token available" -ForegroundColor Yellow
}

# Test 4: /admin-test endpoint
if ($token) {
    Write-Host "`n[4] Testing GET /api/auth/admin-test" -ForegroundColor Yellow
    try {
        $adminResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/admin-test" -Method GET -Headers @{"Authorization"="Bearer $token"} -ErrorAction Stop
        Write-Host "Status: $($adminResponse.StatusCode)" -ForegroundColor Green
        Write-Host "Response: $($adminResponse.Content)" -ForegroundColor Green
    } catch {
        Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
        if ($_.Exception.Response) {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response: $responseBody" -ForegroundColor Yellow
            Write-Host "(403 is expected if user is not admin)" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "`n[4] Skipping /api/auth/admin-test - No token available" -ForegroundColor Yellow
}

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "Testing Complete" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

