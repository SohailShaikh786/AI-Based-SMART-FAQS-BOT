# Environment Variables Guide

## Overview

This project uses environment variables to securely manage API keys and sensitive configuration data. All environment variables are prefixed with `VITE_` to make them accessible in the Vite-based React application.

## Configuration Files

### `.env` (Local Development)
Contains actual values for local development. **Never commit this file to version control.**

```env
VITE_APP_ID=app-8984111omept
VITE_GROQ_API_KEY=your_api_key_here
VITE_API_KEY=your_api_key_here
VITE_ORIGINAL_KEY=your_original_key_here
```

### `.env.example` (Template)
Contains placeholder values as a template. **This file should be committed to version control.**

```env
VITE_APP_ID=app-8984111omept
VITE_GROQ_API_KEY=your_api_key_here
VITE_API_KEY=your_api_key_here
VITE_ORIGINAL_KEY=your_original_key_here
```

## Available Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_APP_ID` | Application identifier for MCP integration | Yes | `app-8984111omept` |
| `VITE_GROQ_API_KEY` | Groq API key for Llama 3.3 70B model | No | `your_api_key_here` |
| `VITE_API_KEY` | General API key (to be provided later) | No | `your_api_key_here` |
| `VITE_ORIGINAL_KEY` | Original key (to be provided later) | No | `your_original_key_here` |

## How to Access Environment Variables

### TypeScript Type Definitions

Environment variables are type-safe thanks to TypeScript definitions in `src/vite-env.d.ts`:

```typescript
interface ImportMetaEnv {
  readonly VITE_APP_ID: string;
  readonly VITE_GROQ_API_KEY: string;
  readonly VITE_API_KEY: string;
  readonly VITE_ORIGINAL_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

### Accessing Variables in Code

#### Example 1: Basic Access

```typescript
// Access environment variables using import.meta.env
const appId = import.meta.env.VITE_APP_ID;
const apiKey = import.meta.env.VITE_API_KEY;
const originalKey = import.meta.env.VITE_ORIGINAL_KEY;

console.log('App ID:', appId);
console.log('API Key:', apiKey ? 'Configured' : 'Not configured');
```

#### Example 2: Conditional Logic

```typescript
// Check if a key is configured before using it
const API_KEY = import.meta.env.VITE_API_KEY;
const USE_API = API_KEY && API_KEY !== 'your_api_key_here';

if (USE_API) {
  console.log('API key is configured');
  // Use the API
} else {
  console.log('API key not configured, using fallback');
  // Use fallback logic
}
```

#### Example 3: API Service Configuration

```typescript
// src/services/apiService.ts
const API_KEY = import.meta.env.VITE_API_KEY;
const ORIGINAL_KEY = import.meta.env.VITE_ORIGINAL_KEY;

export async function fetchData() {
  const response = await fetch('https://api.example.com/data', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'X-Original-Key': ORIGINAL_KEY,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}
```

#### Example 4: Validation and Error Handling

```typescript
// src/utils/config.ts
export function validateEnvironment() {
  const requiredVars = {
    VITE_APP_ID: import.meta.env.VITE_APP_ID
  };

  const optionalVars = {
    VITE_API_KEY: import.meta.env.VITE_API_KEY,
    VITE_ORIGINAL_KEY: import.meta.env.VITE_ORIGINAL_KEY,
    VITE_GROQ_API_KEY: import.meta.env.VITE_GROQ_API_KEY
  };

  // Check required variables
  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  // Log optional variables status
  for (const [key, value] of Object.entries(optionalVars)) {
    const isConfigured = value && value !== 'your_api_key_here' && value !== 'your_original_key_here';
    console.log(`${key}: ${isConfigured ? '✅ Configured' : '⚠️ Not configured'}`);
  }
}
```

#### Example 5: React Component Usage

```typescript
// src/components/ApiStatus.tsx
import { useEffect, useState } from 'react';

export function ApiStatus() {
  const [status, setStatus] = useState<string>('Checking...');

  useEffect(() => {
    const apiKey = import.meta.env.VITE_API_KEY;
    const originalKey = import.meta.env.VITE_ORIGINAL_KEY;

    const apiConfigured = apiKey && apiKey !== 'your_api_key_here';
    const originalConfigured = originalKey && originalKey !== 'your_original_key_here';

    if (apiConfigured && originalConfigured) {
      setStatus('✅ All keys configured');
    } else if (apiConfigured || originalConfigured) {
      setStatus('⚠️ Partially configured');
    } else {
      setStatus('❌ No keys configured');
    }
  }, []);

  return <div>API Status: {status}</div>;
}
```

## Setup Instructions

### For New Developers

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-faq-bot
   ```

2. **Copy the example environment file**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` and add your actual keys**
   ```bash
   # Open .env in your editor
   nano .env
   # or
   code .env
   ```

4. **Replace placeholders with actual values**
   ```env
   VITE_APP_ID=app-8984111omept
   VITE_GROQ_API_KEY=gsk_your_actual_groq_key
   VITE_API_KEY=your_actual_api_key
   VITE_ORIGINAL_KEY=your_actual_original_key
   ```

5. **Install dependencies and start**
   ```bash
   pnpm install
   pnpm run dev
   ```

### For Production Deployment

1. **Set environment variables in your hosting platform**
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Build & Deploy → Environment
   - AWS: Use AWS Secrets Manager or Parameter Store
   - Docker: Use `--env-file` or `-e` flags

2. **Never commit `.env` to version control**
   - The `.gitignore` file already excludes `.env`
   - Always use `.env.example` as a template

3. **Rotate keys regularly**
   - Update keys in your hosting platform
   - Redeploy the application

## Security Best Practices

### ✅ Do

- ✅ Store sensitive keys in `.env` file
- ✅ Keep `.env` in `.gitignore`
- ✅ Use `.env.example` as a template
- ✅ Validate environment variables on startup
- ✅ Use different keys for development and production
- ✅ Rotate keys regularly
- ✅ Use environment-specific files (`.env.development`, `.env.production`)

### ❌ Don't

- ❌ Commit `.env` to version control
- ❌ Hardcode API keys in source code
- ❌ Share API keys in chat or email
- ❌ Use production keys in development
- ❌ Expose keys in client-side code (except VITE_ prefixed ones)
- ❌ Log sensitive keys to console
- ❌ Include keys in error messages

## Troubleshooting

### Environment Variables Not Loading

**Problem**: `import.meta.env.VITE_API_KEY` returns `undefined`

**Solutions**:
1. Ensure the variable name starts with `VITE_`
2. Restart the development server after changing `.env`
3. Check that `.env` file is in the project root
4. Verify the variable is defined in `src/vite-env.d.ts`

### TypeScript Errors

**Problem**: TypeScript complains about missing properties

**Solution**: Update `src/vite-env.d.ts` to include the new variable:
```typescript
interface ImportMetaEnv {
  readonly VITE_APP_ID: string;
  readonly VITE_GROQ_API_KEY: string;
  readonly VITE_API_KEY: string;
  readonly VITE_ORIGINAL_KEY: string;
  readonly VITE_NEW_VARIABLE: string; // Add new variables here
}
```

### Variables Not Updating

**Problem**: Changes to `.env` not reflected in the app

**Solutions**:
1. Stop the dev server (Ctrl+C)
2. Start it again: `pnpm run dev`
3. Clear browser cache
4. Check for typos in variable names

## Example: Complete API Service

Here's a complete example of an API service using environment variables:

```typescript
// src/services/exampleApiService.ts

// Import environment variables
const API_KEY = import.meta.env.VITE_API_KEY;
const ORIGINAL_KEY = import.meta.env.VITE_ORIGINAL_KEY;
const APP_ID = import.meta.env.VITE_APP_ID;

// Validate configuration
const isConfigured = API_KEY && API_KEY !== 'your_api_key_here';

// API configuration
const API_BASE_URL = 'https://api.example.com';

// Helper function to check if API is configured
export function isApiConfigured(): boolean {
  return isConfigured;
}

// Helper function to get API info
export function getApiInfo() {
  return {
    configured: isConfigured,
    appId: APP_ID,
    hasApiKey: !!API_KEY && API_KEY !== 'your_api_key_here',
    hasOriginalKey: !!ORIGINAL_KEY && ORIGINAL_KEY !== 'your_original_key_here'
  };
}

// Example API call
export async function fetchUserData(userId: string) {
  if (!isConfigured) {
    throw new Error('API key not configured. Please add VITE_API_KEY to your .env file.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'X-Original-Key': ORIGINAL_KEY,
        'X-App-Id': APP_ID,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('API authentication failed. Please check your API key.');
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error(`API request failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

// Example POST request
export async function createResource(data: any) {
  if (!isConfigured) {
    throw new Error('API key not configured.');
  }

  const response = await fetch(`${API_BASE_URL}/resources`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'X-Original-Key': ORIGINAL_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to create resource: ${response.status}`);
  }

  return await response.json();
}
```

## Summary

### Quick Reference

**Access a variable:**
```typescript
const value = import.meta.env.VITE_VARIABLE_NAME;
```

**Check if configured:**
```typescript
const isConfigured = value && value !== 'your_api_key_here';
```

**Use in API call:**
```typescript
headers: {
  'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
}
```

### Files Modified

- ✅ `.env` - Contains actual values (not committed)
- ✅ `.env.example` - Template with placeholders (committed)
- ✅ `.gitignore` - Excludes `.env` from version control
- ✅ `src/vite-env.d.ts` - TypeScript type definitions
- ✅ `ENVIRONMENT_VARIABLES.md` - This documentation

### Status

- ✅ Environment variables configured
- ✅ TypeScript types defined
- ✅ `.gitignore` updated
- ✅ Security best practices implemented
- ✅ Example code provided
- ✅ Documentation complete

---

**Last Updated**: 2025-12-16
**Status**: ✅ Complete and Secure
