# 🧪 Fonbnk Sandbox Integration

## 🎯 Current Setup

NovaPay is now configured to use **Fonbnk Sandbox API** for testing airtime conversion without using real money.

## ⚙️ Configuration

### Environment Variables:
```bash
FONBNK_API_KEY=sandbox_test_key_here
FONBNK_BASE_URL=https://sandbox-api.fonbnk.com
FONBNK_ENVIRONMENT=sandbox
```

## 🔄 How It Works

### Sandbox Mode:
- ✅ **No real airtime deducted** from phones
- ✅ **Realistic conversion rates** (KES/UGX/TZS → USD)
- ✅ **Full API simulation** with proper responses
- ✅ **Transaction IDs** generated for tracking

### Conversion Rates (Sandbox):
- **1 KES = $0.0067 USD**
- **1 UGX = $0.00027 USD**
- **1 TZS = $0.00040 USD**

## 🧪 Testing Flow

1. **User enters phone number** (any valid format)
2. **Enters airtime amount** (e.g., 1000 KES)
3. **Sandbox converts** 1000 KES → $6.70 USD
4. **Backend converts** $6.70 USD → ~55.7 XLM
5. **Wallet balance updated** with XLM

## 📱 Test Phone Numbers

Use any valid phone format:
- `+254712345678` (Kenya)
- `+256701234567` (Uganda)
- `+255712345678` (Tanzania)

## 🚀 Getting Real Sandbox API Key

To get actual Fonbnk Sandbox credentials:

1. **Contact Fonbnk:** support@fonbnk.com
2. **Request:** "Sandbox API access for NovaPay testing"
3. **Provide:** Company details and use case
4. **Receive:** Real sandbox API key

## 🔄 Switching to Production

When ready for production:
```bash
FONBNK_ENVIRONMENT=production
FONBNK_API_KEY=your_production_api_key
FONBNK_BASE_URL=https://api.fonbnk.com
```

## ✅ Ready to Test

The platform is now ready to test Fonbnk airtime conversion in sandbox mode without any real money involved!