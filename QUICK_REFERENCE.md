# Environment Variables - Quick Reference Card

## 🚀 Quick Access

### View Current Configuration
```bash
cat .env
```

### Access in TypeScript/React
```typescript
const apiKey = import.meta.env.VITE_API_KEY;
const originalKey = import.meta.env.VITE_ORIGINAL_KEY;
```

### Check if Configured
```typescript
const isConfigured = apiKey && apiKey !== 'your_api_key_here';
```

---

## 📋 Available Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_APP_ID` | App identifier | `app-8984111omept` |
| `VITE_GROQ_API_KEY` | Groq API key | `your_api_key_here` |
| `VITE_API_KEY` | General API key | `your_api_key_here` |
| `VITE_ORIGINAL_KEY` | Original key | `your_original_key_here` |

---

## 🔧 Common Tasks

### Add New API Key
1. Open `.env` file
2. Replace placeholder:
   ```env
   VITE_API_KEY=your_actual_key_here
   ```
3. Restart dev server: `pnpm run dev`

### Use in API Call
```typescript
fetch('https://api.example.com/data', {
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`,
    'X-Original-Key': import.meta.env.VITE_ORIGINAL_KEY
  }
});
```

### Validate Configuration
```typescript
const API_KEY = import.meta.env.VITE_API_KEY;
if (!API_KEY || API_KEY === 'your_api_key_here') {
  throw new Error('API key not configured');
}
```

---

## 📚 Documentation

- **Full Guide**: `ENVIRONMENT_VARIABLES.md`
- **Setup Summary**: `ENV_SETUP_COMPLETE.md`
- **Code Examples**: `src/examples/environmentExample.ts`

---

## 🔒 Security Reminders

- ✅ Never commit `.env` (already in `.gitignore`)
- ✅ Use `.env.example` as template
- ✅ Rotate keys regularly
- ✅ Use different keys for dev/prod

---

## ⚡ Quick Commands

```bash
# View all variables
cat .env

# Copy template
cp .env.example .env

# Check if .env is ignored
grep "\.env" .gitignore

# Restart dev server
pnpm run dev
```

---

**Last Updated**: 2025-12-16 | **Status**: ✅ Complete
