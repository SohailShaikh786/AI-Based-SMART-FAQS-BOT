# API Configuration Guide

## Current Status

✅ **The application supports two API modes!**

### Mode 1: MCP Integration (Default)
The Large Language Model API is pre-integrated through MCP (Model Context Protocol) and requires no additional setup. This mode uses **Gemini 2.5 Flash**.

### Mode 2: Direct Groq API
You can optionally use your own Groq API key for direct access to **Llama 3.3 70B Versatile** model.

## Quick Start

### Using Default MCP Integration (No Setup Required)
Just run the application - it works out of the box!

```bash
pnpm install
pnpm run dev
```

### Using Your Own Groq API Key (Optional)

1. Get your API key from [Groq Console](https://console.groq.com/keys)
2. Open `.env` file
3. Replace `your_api_key_here` with your actual API key:
   ```env
   VITE_GROQ_API_KEY=gsk_your_actual_key_here
   ```
4. Restart the development server

The application will automatically detect and use your Groq API key!

## What's Already Configured

### 1. Environment Variables
Location: `.env`
```env
VITE_APP_ID=app-8984111omept
VITE_GROQ_API_KEY=your_api_key_here
```

- `VITE_APP_ID`: Required for MCP integration (already set)
- `VITE_GROQ_API_KEY`: Optional - add your Groq API key to use Groq instead of MCP

### 2. API Integration
Location: `src/services/llmService.ts`

The service automatically detects which API to use:
- If `VITE_GROQ_API_KEY` is set and valid → Uses Groq API
- Otherwise → Uses MCP Integration (default)

### 3. API Endpoints

**MCP Integration:**
```typescript
https://api-integrations.appmedo.com/.../gemini-2.5-flash:streamGenerateContent
```

**Groq API:**
```typescript
https://api.groq.com/openai/v1/chat/completions
```

## How It Works

1. **User asks a question** → Frontend
2. **Semantic search** → Find relevant FAQs (client-side)
3. **API request** → Send question + context to AI
   - **MCP Mode**: Gemini 2.5 Flash (free, pre-configured)
   - **Groq Mode**: Llama 3.3 70B Versatile (requires API key)
4. **Streaming response** → AI generates answer in real-time
5. **Display** → Show answer with source attribution

## API Comparison

| Feature | MCP Integration | Groq API |
|---------|----------------|----------|
| **Model** | Gemini 2.5 Flash | Llama 3.3 70B Versatile |
| **Setup** | None required | API key needed |
| **Cost** | Free (included) | Free tier available |
| **Speed** | Fast | Very fast |
| **Quality** | Excellent | Excellent |
| **Rate Limits** | Shared | Per account |

## Configuration Options

### Option 1: Use Default (Recommended for Quick Start)
No configuration needed! Just run:
```bash
pnpm run dev
```

### Option 2: Use Groq API (Recommended for Production)

**Step 1: Get API Key**
1. Visit [Groq Console](https://console.groq.com/keys)
2. Sign up or log in
3. Create a new API key
4. Copy the key (starts with `gsk_`)

**Step 2: Configure**
Edit `.env`:
```env
VITE_APP_ID=app-8984111omept
VITE_GROQ_API_KEY=gsk_your_actual_key_here
```

**Step 3: Restart**
```bash
# Stop the dev server (Ctrl+C)
pnpm run dev
```

**Step 4: Verify**
Open the application and look for the API badge in the conversation card. It should show:
- "Groq - llama-3.3-70b-versatile" (if using Groq)
- "MCP Integration - Gemini 2.5 Flash" (if using MCP)

## Testing the API

### Quick Test
1. Start the application: `pnpm run dev`
2. Open in browser
3. Check the API badge in the conversation card
4. Ask a question: "What is this application?"
5. You should see a streaming response

### Expected Behavior
- ✅ API badge shows current provider
- ✅ Loading animation appears
- ✅ Answer streams in real-time
- ✅ Source FAQs are displayed
- ✅ Markdown formatting works

### If Something Goes Wrong

**Error: "Groq API authentication failed"**
- Check that your API key is correct
- Verify it starts with `gsk_`
- Make sure there are no extra spaces
- Restart the development server

**Error: "Too many requests"**
- Wait a moment and try again
- Consider using MCP integration (no rate limits)
- Check your Groq account quota

**Error: "The AI service is temporarily unavailable"**
- Check your internet connection
- Try switching to the other API mode
- Check browser console for details

## Switching Between APIs

### Switch to Groq
1. Add valid API key to `.env`
2. Restart dev server
3. Verify badge shows "Groq"

### Switch to MCP
1. Remove or comment out `VITE_GROQ_API_KEY` in `.env`:
   ```env
   # VITE_GROQ_API_KEY=gsk_your_key
   ```
2. Or set it to placeholder:
   ```env
   VITE_GROQ_API_KEY=your_api_key_here
   ```
3. Restart dev server
4. Verify badge shows "MCP Integration"

## API Response Format

### Groq API (OpenAI-compatible)
```json
{
  "choices": [{
    "delta": {
      "content": "..."
    }
  }]
}
```

### MCP API (Gemini format)
```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "text": "..."
      }]
    }
  }]
}
```

The application automatically handles both formats!

## Customizing the API Behavior

### Change the Groq Model
Edit `src/services/llmService.ts`:
```typescript
body: JSON.stringify({
  model: 'llama-3.3-70b-versatile',  // Change this
  // Other options:
  // - 'mixtral-8x7b-32768'
  // - 'llama-3.1-70b-versatile'
  // - 'gemma2-9b-it'
  ...
})
```

### Adjust Response Parameters
```typescript
body: JSON.stringify({
  model: 'llama-3.3-70b-versatile',
  temperature: 0.7,        // Creativity (0.0-1.0)
  max_tokens: 1024,        // Response length
  stream: true,            // Enable streaming
  ...
})
```

### Change Number of Retrieved FAQs
Edit `src/services/embeddingService.ts`:
```typescript
export function searchSimilarFAQs(
  query: string,
  faqsWithEmbeddings: FAQWithEmbedding[],
  topK: number = 3  // Change this number
): FAQ[]
```

## Advanced Configuration

### Using a Different LLM Provider

To add support for another provider (OpenAI, Anthropic, etc.):

1. Add API key to `.env`:
   ```env
   VITE_OPENAI_API_KEY=sk-...
   ```

2. Update `src/vite-env.d.ts`:
   ```typescript
   interface ImportMetaEnv {
     readonly VITE_APP_ID: string;
     readonly VITE_GROQ_API_KEY: string;
     readonly VITE_OPENAI_API_KEY: string;
   }
   ```

3. Add implementation in `src/services/llmService.ts`:
   ```typescript
   async function* generateOpenAIStream(...) {
     // Implementation here
   }
   ```

4. Update the routing logic in `generateAnswerStream()`

## Monitoring & Debugging

### Check Which API Is Active
Look at the badge in the conversation card header:
- "Groq - llama-3.3-70b-versatile" → Using Groq
- "MCP Integration - Gemini 2.5 Flash" → Using MCP

### Check API Calls in DevTools
Open browser DevTools → Network tab:
- Groq: Filter by "groq.com"
- MCP: Filter by "appmedo.com"

You'll see:
- Request headers (including Authorization or X-App-Id)
- Request body (your question + context)
- Response stream (SSE events)
- Status codes and errors

### Common Status Codes
- `200` - Success (streaming response)
- `401` - Authentication failed (check API key)
- `429` - Rate limit exceeded (wait and retry)
- `500` - Server error (temporary issue)

### Enable Debug Logging
The service already logs errors. Check browser console for:
- "Error in generateGroqStream:" → Groq API issues
- "Error in generateMCPStream:" → MCP API issues
- "Error parsing ... SSE data:" → Response parsing issues

## Security Notes

- ✅ API keys are stored in `.env` (not committed to git)
- ✅ `.env` is in `.gitignore`
- ✅ Client-side only (no backend secrets)
- ⚠️ Don't expose API keys in client-side code
- ⚠️ Don't commit `.env` to version control

## Troubleshooting

### API Not Switching
1. Verify `.env` file changes
2. Restart dev server completely
3. Clear browser cache
4. Check console for errors

### Groq API Key Not Working
1. Verify key format (starts with `gsk_`)
2. Check for extra spaces or quotes
3. Verify key is active in Groq Console
4. Check rate limits

### MCP Integration Not Working
1. Verify `VITE_APP_ID` is set correctly
2. Check internet connection
3. Try removing Groq API key to force MCP mode

## Summary

**Two Modes Available:**
1. **MCP Integration** (Default) - No setup, works immediately
2. **Groq API** (Optional) - Add your API key for direct access

**To Use MCP (Default):**
- No action required
- Just run `pnpm run dev`

**To Use Groq:**
1. Get API key from [Groq Console](https://console.groq.com/keys)
2. Add to `.env`: `VITE_GROQ_API_KEY=gsk_your_key`
3. Restart dev server
4. Verify badge shows "Groq"

**Check Active API:**
- Look at the badge in the conversation card
- Check browser DevTools → Network tab

---

**Status**: ✅ Dual-Mode Configured | **Action Required**: None (optional Groq setup) | **Ready to Use**: Yes
