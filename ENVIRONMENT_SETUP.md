# Environment Setup Guide

This admin panel now supports switching between local and remote backend environments.

## 🚀 Quick Start

### Development Mode (Localhost)
When running in development mode (`npm run dev`), the app will automatically use:
- **Backend URL**: `http://localhost:8000`
- **Environment**: Local Development

### Production Mode (Remote)
When running in production mode (`npm run build`), the app will automatically use:
- **Backend URL**: `https://real-estate-crm-backend-yfxi.onrender.com`
- **Environment**: Remote Production

## 🔄 Manual Environment Switching

### Option 1: Using the Environment Switcher (Recommended)
1. Look for the environment switcher button in the top-right corner of the dashboard
2. Click the button to see current environment info
3. Select your desired environment:
   - 🏠 **Local Development** - Uses `http://localhost:8000`
   - ☁️ **Remote Production** - Uses `https://real-estate-crm-backend-yfxi.onrender.com`

### Option 2: Code Configuration
Edit `src/config/environment.js` and change the `CURRENT_ENVIRONMENT` value:

```javascript
// For localhost
export const CURRENT_ENVIRONMENT = ENVIRONMENTS.LOCAL

// For remote backend
export const CURRENT_ENVIRONMENT = ENVIRONMENTS.REMOTE
```

## 🌍 Environment Details

### Local Development
- **URL**: `http://localhost:8000`
- **Timeout**: 10 seconds
- **Use Case**: Development and testing with local backend

### Remote Production
- **URL**: `https://real-estate-crm-backend-yfxi.onrender.com`
- **Timeout**: 15 seconds
- **Use Case**: Production deployment and testing with live backend

## 🔧 Configuration Files

- `src/config/environment.js` - Environment definitions and settings
- `src/config/api.js` - API configuration and helper functions
- `src/components/EnvironmentSwitcher.jsx` - UI component for switching

## 🐛 Debugging

The current environment and API URL are logged to the console when the app loads. Check the browser console to see:
- Current environment name
- API base URL being used

## 📝 Notes

- The environment switcher requires a page reload to take effect
- Authentication tokens are preserved across environment switches
- All API calls automatically use the correct base URL for the selected environment 