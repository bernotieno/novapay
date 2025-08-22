#!/usr/bin/env python3
import requests
import json

BASE_URL = "http://localhost:3000"

def test_wallet_sdk():
    print("🧪 Testing NovaPay Wallet SDK")
    
    # 1. Register user
    print("\n1. Registering test user...")
    register_data = {
        "email": "sdktest@example.com",
        "password": "password123",
        "full_name": "SDK Test User"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        if response.status_code == 200:
            token = response.json()["token"]
            print(f"✅ User registered, token: {token[:20]}...")
        else:
            print(f"❌ Registration failed: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return

    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create wallet
    print("\n2. Creating wallet...")
    try:
        response = requests.post(f"{BASE_URL}/sdk/wallet/create", headers=headers)
        if response.status_code == 200:
            wallet = response.json()
            print(f"✅ Wallet created: {wallet['public_key'][:10]}...")
            secret_key = wallet["secret_key"]
        else:
            print(f"❌ Wallet creation failed: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Wallet creation error: {e}")
        return

    # 3. Fund testnet
    print("\n3. Funding testnet account...")
    try:
        response = requests.post(
            f"{BASE_URL}/sdk/wallet/fund-testnet",
            headers=headers,
            json={"secret_key": secret_key}
        )
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Funding: {result}")
        else:
            print(f"❌ Funding failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Funding error: {e}")

    # 4. Get balance
    print("\n4. Getting balance...")
    try:
        response = requests.post(
            f"{BASE_URL}/sdk/wallet/balance",
            headers=headers,
            json={"secret_key": secret_key}
        )
        if response.status_code == 200:
            balance = response.json()
            print(f"✅ Balance: {balance}")
        else:
            print(f"❌ Balance check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Balance error: {e}")

    print("\n🎉 SDK test completed!")

if __name__ == "__main__":
    test_wallet_sdk()