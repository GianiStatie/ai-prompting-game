#!/usr/bin/env python3
"""
Rate limit testing script for localhost:8000/limit-test endpoint
Tests the 10 requests per minute limit
"""

import requests
import time
import json
from datetime import datetime

def test_rate_limit():
    base_url = "http://localhost:8000"
    endpoint = "/limit-test"
    url = f"{base_url}{endpoint}"
    
    print(f"Testing rate limit on: {url}")
    print(f"Expected limit: 10 requests per minute")
    print("-" * 50)
    
    successful_requests = 0
    rate_limited_requests = 0
    
    # Make 20 requests quickly to test the rate limit
    for i in range(1, 21):
        try:
            start_time = time.time()
            response = requests.get(url, timeout=10)
            end_time = time.time()
            
            timestamp = datetime.now().strftime("%H:%M:%S.%f")[:-3]
            response_time = (end_time - start_time) * 1000  # ms
            
            if response.status_code == 200:
                successful_requests += 1
                print(f"[{timestamp}] Request {i:2d}: ✅ SUCCESS (200) - {response_time:.0f}ms - {response.json()}")
            elif response.status_code == 429:  # Too Many Requests
                rate_limited_requests += 1
                print(f"[{timestamp}] Request {i:2d}: 🚫 RATE LIMITED (429) - {response_time:.0f}ms")
                try:
                    error_detail = response.json()
                    print(f"                    Error details: {error_detail}")
                except:
                    print(f"                    Error text: {response.text}")
            else:
                print(f"[{timestamp}] Request {i:2d}: ❌ ERROR ({response.status_code}) - {response_time:.0f}ms")
                
        except requests.exceptions.RequestException as e:
            timestamp = datetime.now().strftime("%H:%M:%S.%f")[:-3]
            print(f"[{timestamp}] Request {i:2d}: 💥 CONNECTION ERROR - {str(e)}")
        
        # Small delay between requests to see timing
        time.sleep(0.1)
    
    print("-" * 50)
    print(f"Summary:")
    print(f"  Successful requests: {successful_requests}")
    print(f"  Rate limited requests: {rate_limited_requests}")
    print(f"  Total requests made: {successful_requests + rate_limited_requests}")
    
    if rate_limited_requests > 0:
        print(f"✅ Rate limiting is working! Got rate limited after {successful_requests} requests.")
    else:
        print(f"⚠️  Rate limiting might not be working - all {successful_requests} requests succeeded.")

def test_rate_limit_recovery():
    """Test that rate limit resets after waiting"""
    print("\n" + "=" * 60)
    print("Testing rate limit recovery...")
    print("Waiting 65 seconds for rate limit to reset...")
    
    url = "http://localhost:8000/limit-test"
    
    # Wait for rate limit to reset (60 seconds + buffer)
    for remaining in range(65, 0, -1):
        print(f"\rWaiting... {remaining} seconds remaining", end="", flush=True)
        time.sleep(1)
    
    print("\nTesting after rate limit reset:")
    
    try:
        response = requests.get(url, timeout=10)
        timestamp = datetime.now().strftime("%H:%M:%S.%f")[:-3]
        
        if response.status_code == 200:
            print(f"[{timestamp}] ✅ SUCCESS after reset: {response.json()}")
        else:
            print(f"[{timestamp}] ❌ Still getting error: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"Connection error: {e}")

if __name__ == "__main__":
    print("🚀 Starting rate limit test...")
    print("Make sure your FastAPI server is running on localhost:8000")
    print()
    
    # First test - rapid requests to trigger rate limit
    test_rate_limit()
    
    # Ask user if they want to test recovery
    user_input = input("\nDo you want to test rate limit recovery? (y/n): ").lower().strip()
    if user_input in ['y', 'yes']:
        test_rate_limit_recovery()
    
    print("\n🏁 Rate limit testing complete!") 