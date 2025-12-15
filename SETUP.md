# Setup Guide - Smart FAQ Bot

## Overview
This guide will help you set up and configure the Smart FAQ Bot application.

## API Configuration

### Current Setup
The application is **pre-configured** with the Large Language Model API through MCP integration. You don't need to add any API keys to get started.

### API Details
- **Model**: Gemini 2.5 Flash
- **Integration**: MCP (Model Context Protocol)
- **Endpoint**: Pre-configured streaming endpoint
- **Authentication**: Handled automatically via VITE_APP_ID

### Environment Variables

The `.env` file contains:
```env
VITE_APP_ID=app-8984111omept
```

This is the only configuration needed. The API integration is handled automatically.

## Installation Steps

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Verify Environment
Check that the `.env` file exists and contains:
```env
VITE_APP_ID=app-8984111omept
```

### 3. Start Development Server
```bash
pnpm run dev
```

The application will start and display a URL (typically http://localhost:5173)

### 4. Validate Build
```bash
pnpm run lint
```

All checks should pass successfully.

## Testing the Application

### Test the FAQ Bot
1. Open the application in your browser
2. Navigate to the home page
3. Type a test question: "What is this application?"
4. You should see:
   - A loading animation
   - The AI response streaming in real-time
   - Source FAQs displayed below the answer

### Test FAQ Management
1. Navigate to "FAQ Management" page
2. Try adding a new FAQ
3. Edit an existing FAQ
4. Export FAQs to a Markdown file
5. Import the file back

## Customization

### Adding Your Own FAQs

**Option 1: Using the UI**
1. Go to FAQ Management page
2. Click "Add FAQ"
3. Enter question and answer
4. Click "Add FAQ" to save

**Option 2: Edit the Markdown File**
1. Open `src/data/faqs.md`
2. Add new sections following this format:
   ```markdown
   ## Your Question Here?
   Your detailed answer here.
   ```
3. Save and refresh the application

### Customizing the Design

Edit `src/index.css` to change colors:
```css
:root {
  --primary: 221 83% 23%;        /* Deep blue - change this */
  --background: 220 13% 95%;     /* Light gray - change this */
}
```

### Modifying AI Behavior

Edit `src/services/llmService.ts` to change the system prompt:
```typescript
const systemPrompt = `You are a helpful FAQ assistant. Your role is to...`;
```

## Troubleshooting

### Issue: Application won't start
**Solution**: 
- Check that Node.js 18+ is installed: `node -v`
- Delete `node_modules` and run `pnpm install` again
- Check for port conflicts (default: 5173)

### Issue: AI doesn't respond
**Solution**:
- Check browser console for errors
- Verify internet connection
- Check that VITE_APP_ID is set correctly in `.env`

### Issue: FAQs not loading
**Solution**:
- Verify `src/data/faqs.md` exists
- Check Markdown format (questions start with `##`)
- Clear browser cache and refresh

### Issue: Build errors
**Solution**:
- Run `pnpm run lint` to see specific errors
- Check TypeScript errors in your IDE
- Verify all imports are correct

## File Structure

```
src/
├── components/
│   ├── common/
│   │   └── Header.tsx          # Navigation
│   └── ui/                      # UI components
├── data/
│   └── faqs.md                  # FAQ knowledge base (edit this!)
├── pages/
│   ├── FAQBot.tsx              # Main chat interface
│   └── FAQManagement.tsx       # FAQ management
├── services/
│   ├── embeddingService.ts     # Search logic
│   └── llmService.ts           # API integration (API config here)
└── utils/
    └── faqParser.ts            # Markdown parser
```

## Key Files to Know

### Configuration Files
- `.env` - Environment variables (API configuration)
- `src/index.css` - Design system (colors, fonts)
- `src/routes.tsx` - Page routing

### Data Files
- `src/data/faqs.md` - FAQ knowledge base (main content)

### Service Files
- `src/services/llmService.ts` - API integration and prompts
- `src/services/embeddingService.ts` - Search algorithm

## Next Steps

1. **Add Your FAQs**: Replace the sample FAQs with your own content
2. **Customize Design**: Update colors and branding to match your style
3. **Test Thoroughly**: Try various questions to ensure accuracy
4. **Deploy**: Build for production with `pnpm run build`

## Support

For technical details, see:
- `IMPLEMENTATION.md` - Technical architecture
- `README.md` - General documentation
- Browser console - Error messages and logs

## Notes

- The API is pre-configured and ready to use
- No additional API keys are needed
- The system uses streaming for real-time responses
- All data is processed client-side (no backend required)
- FAQ embeddings are generated on-the-fly

---

**Ready to use!** The application is fully configured and ready for deployment.
