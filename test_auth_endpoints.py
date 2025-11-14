#!/usr/bin/env python3
"""
Test script for authentication endpoints
"""
import requests
import json
import sys

BASE_URL = "http://localhost:5000"

def test_register():
    """Test /api/auth/register endpoint"""
    print("\n" + "="*50)
    print("Testing: POST /api/auth/register")
    print("="*50)
    
    url = f"{BASE_URL}/api/auth/register"
    data = {
        "email": "test@example.com",
        "password": "test123",
        "first_name": "Test",
        "last_name": "User"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code in [201, 400]  # 400 if user already exists
    except requests.exceptions.ConnectionError:
        print("ERROR: Could not connect to server. Is it running?")
        return False
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def test_login():
    """Test /api/auth/login endpoint"""
    print("\n" + "="*50)
    print("Testing: POST /api/auth/login")
    print("="*50)
    
    url = f"{BASE_URL}/api/auth/login"
    data = {
        "email": "test@example.com",
        "password": "test123"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            token = response.json().get("token")
            print(f"\nToken received: {token[:50]}..." if token else "No token received")
            return token
        return None
    except requests.exceptions.ConnectionError:
        print("ERROR: Could not connect to server. Is it running?")
        return None
    except Exception as e:
        print(f"ERROR: {e}")
        return None

def test_me(token):
    """Test /api/auth/me endpoint"""
    print("\n" + "="*50)
    print("Testing: GET /api/auth/me (with token)")
    print("="*50)
    
    if not token:
        print("ERROR: No token provided. Skipping test.")
        return False
    
    url = f"{BASE_URL}/api/auth/me"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.get(url, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except requests.exceptions.ConnectionError:
        print("ERROR: Could not connect to server. Is it running?")
        return False
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def test_admin_test(token):
    """Test /api/auth/admin-test endpoint"""
    print("\n" + "="*50)
    print("Testing: GET /api/auth/admin-test (with token)")
    print("="*50)
    
    if not token:
        print("ERROR: No token provided. Skipping test.")
        return False
    
    url = f"{BASE_URL}/api/auth/admin-test"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    try:
        response = requests.get(url, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code in [200, 403]  # 403 if not admin
    except requests.exceptions.ConnectionError:
        print("ERROR: Could not connect to server. Is it running?")
        return False
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def main():
    print("\n" + "="*50)
    print("AUTHENTICATION ENDPOINTS TEST SUITE")
    print("="*50)
    
    # Test 1: Register
    register_success = test_register()
    
    # Test 2: Login
    token = test_login()
    
    # Test 3: /me endpoint
    me_success = test_me(token)
    
    # Test 4: /admin-test endpoint
    admin_test_success = test_admin_test(token)
    
    # Summary
    print("\n" + "="*50)
    print("TEST SUMMARY")
    print("="*50)
    print(f"[OK] Register: {'PASS' if register_success else 'FAIL'}")
    print(f"[OK] Login: {'PASS' if token else 'FAIL'}")
    print(f"[OK] /me: {'PASS' if me_success else 'FAIL'}")
    print(f"[OK] /admin-test: {'PASS' if admin_test_success else 'FAIL (expected if user is not admin)'}")
    print("="*50 + "\n")

if __name__ == "__main__":
    main()

