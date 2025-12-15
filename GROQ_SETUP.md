# Groq API Setup Guide

## Quick Setup (3 Steps)

### Step 1: Get Your API Key
1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up or log in with your account
3. Click "Create API Key"
4. Copy the key (it starts with `gsk_`)

### Step 2: Add to Environment File
1. Open `.env` file in the project root
2. Replace the placeholder with your actual key:
   ```env
   VITE_APP_ID=app-8984111omept
   VITE_GROQ_API_KEY=gsk_your_actual_key_here
   ```

### Step 3: Restart and Verify
1. Stop the development server (Ctrl+C)
2. Start it again: `pnpm run dev`
3. Open the application in your browser
4. Look for the API badge - it should show "Groq - llama-3.3-70b-versatile"

That's it! You're now using Groq API.

## Why Use Groq?

### Benefits
- ✅ **Faster Responses**: Groq's infrastructure is optimized for speed
- ✅ **Your Own Quota**: Personal rate limits, not shared
- ✅ **Free Tier**: Generous free tier for development
- ✅ **Latest Models**: Access to Llama 3.3 70B and other models
- ✅ **Full Control**: Manage your own API usage

### When to Use Groq
- Production deployments
- High-volume usage
- Need for consistent performance
- Want to track your own usage
- Require specific models

### When to Use MCP (Default)
- Quick testing and development
- No API key setup needed
- Shared rate limits are acceptable
- Prefer Gemini 2.5 Flash model

## Troubleshooting

### API Key Not Working
**Problem**: Badge still shows "MCP Integration"

**Solutions**:
1. Verify the key starts with `gsk_`
2. Check for extra spaces or quotes in `.env`
3. Make sure you saved the `.env` file
4. Restart the development server completely
5. Clear browser cache and refresh

### Authentication Failed
**Problem**: Error message "Groq API authentication failed"

**Solutions**:
1. Verify the API key is correct
2. Check if the key is active in Groq Console
3. Make sure you copied the entire key
4. Try generating a new API key

### Rate Limit Errors
**Problem**: "Too many requests" error

**Solutions**:
1. Wait a few moments before trying again
2. Check your usage in Groq Console
3. Consider upgrading your Groq plan
4. Temporarily switch back to MCP mode

## Switching Between APIs

### Switch to Groq
```env
# .env file
VITE_APP_ID=app-8984111omept
VITE_GROQ_API_KEY=gsk_your_actual_key_here
```
Restart server → Badge shows "Groq"

### Switch Back to MCP
```env
# .env file
VITE_APP_ID=app-8984111omept
VITE_GROQ_API_KEY=your_api_key_here
```
Or comment it out:
```env
# .env file
VITE_APP_ID=app-8984111omept
# VITE_GROQ_API_KEY=gsk_your_key
```
Restart server → Badge shows "MCP Integration"

## API Comparison

| Feature | MCP Integration | Groq API |
|---------|----------------|----------|
| Setup Time | 0 minutes | 2 minutes |
| API Key Required | No | Yes |
| Model | Gemini 2.5 Flash | Llama 3.3 70B |
| Speed | Fast | Very Fast |
| Rate Limits | Shared | Personal |
| Cost | Free | Free Tier + Paid |
| Best For | Development | Production |

## Advanced Configuration

### Change the Model
Edit `src/services/llmService.ts` and change the model name:

```typescript
body: JSON.stringify({
  model: 'llama-3.3-70b-versatile',  // Change this line
  ...
})
```

**Available Models**:
- `llama-3.3-70b-versatile` (default, best quality)
- `llama-3.1-70b-versatile` (fast, good quality)
- `mixtral-8x7b-32768` (long context)
- `gemma2-9b-it` (lightweight, fast)

### Adjust Temperature
Control response creativity (0.0 = focused, 1.0 = creative):

```typescript
body: JSON.stringify({
  model: 'llama-3.3-70b-versatile',
  temperature: 0.7,  // Change this (0.0 - 1.0)
  ...
})
```

### Change Max Tokens
Control response length:

```typescript
body: JSON.stringify({
  model: 'llama-3.3-70b-versatile',
  max_tokens: 1024,  // Change this
  ...
})
```

## Monitoring Usage

### Check API Calls
1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by "groq.com"
4. See all API requests and responses

### View Usage in Groq Console
1. Visit [Groq Console](https://console.groq.com)
2. Go to "Usage" section
3. View your API call statistics
4. Monitor your quota

## Security Best Practices

### ✅ Do
- Store API key in `.env` file
- Keep `.env` in `.gitignore`
- Regenerate keys if exposed
- Use environment variables
- Monitor your usage

### ❌ Don't
- Commit `.env` to git
- Share your API key
- Hardcode keys in source code
- Expose keys in client-side code
- Use production keys in development

## Getting Help

### Resources
- [Groq Documentation](https://console.groq.com/docs)
- [Groq API Reference](https://console.groq.com/docs/api-reference)
- [Groq Community](https://console.groq.com/community)

### Common Issues
1. **Key not working**: Regenerate in Groq Console
2. **Rate limits**: Check usage dashboard
3. **Slow responses**: Try different model
4. **Errors**: Check browser console

## Summary

**Quick Setup**:
1. Get API key from [Groq Console](https://console.groq.com/keys)
2. Add to `.env`: `VITE_GROQ_API_KEY=gsk_your_key`
3. Restart server
4. Verify badge shows "Groq"

**Verification**:
- Badge in conversation card shows "Groq - llama-3.3-70b-versatile"
- Network tab shows requests to "groq.com"
- Responses are fast and accurate

**Need Help?**
- Check [API_CONFIGURATION.md](./API_CONFIGURATION.md) for detailed info
- Review [SETUP.md](./SETUP.md) for general setup
- Check browser console for error messages

---

**Status**: Optional Enhancement | **Time Required**: 2 minutes | **Benefit**: Personal API quota and faster responses
