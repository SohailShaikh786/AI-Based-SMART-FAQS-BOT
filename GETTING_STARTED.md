# Getting Started with Smart FAQ Bot

## Welcome! 👋

Your Smart FAQ Bot is **fully configured and ready to use**. No additional setup or API keys are required!

## Quick Start (3 Steps)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Start the Application
```bash
pnpm run dev
```

### 3. Open in Browser
The application will display a URL (typically `http://localhost:5173`). Open it in your browser.

That's it! You're ready to start asking questions.

## What You Can Do

### Ask Questions
1. Go to the home page
2. Type any question (try: "What is this application?")
3. Watch the AI generate an answer in real-time
4. See which FAQs were used to create the answer

### Manage FAQs
1. Click "FAQ Management" in the navigation
2. Add new questions and answers
3. Edit or delete existing FAQs
4. Export your FAQs to backup
5. Import FAQs from Markdown files

## Key Features

✅ **AI-Powered Answers** - Uses Gemini 2.5 Flash for intelligent responses
✅ **Real-Time Streaming** - See answers appear as they're generated
✅ **Semantic Search** - Finds the most relevant FAQs automatically
✅ **Source Attribution** - Shows which FAQs were used
✅ **FAQ Management** - Easy-to-use admin interface
✅ **Import/Export** - Backup and restore your FAQs

## No Configuration Needed

The application is pre-configured with:
- ✅ Large Language Model API (Gemini 2.5 Flash)
- ✅ Authentication (automatic via app ID)
- ✅ Streaming responses
- ✅ Error handling
- ✅ Professional design theme

**You don't need to add any API keys or configure anything!**

## Documentation

For more details, see:
- **README.md** - Overview and quick reference
- **SETUP.md** - Detailed setup instructions
- **API_CONFIGURATION.md** - API details (already configured)
- **IMPLEMENTATION.md** - Technical architecture

## Customization

### Add Your Own FAQs

**Option 1: Use the UI**
1. Go to "FAQ Management" page
2. Click "Add FAQ"
3. Enter your question and answer
4. Click "Add FAQ" to save

**Option 2: Edit the File**
1. Open `src/data/faqs.md`
2. Add new sections:
   ```markdown
   ## Your Question?
   Your answer here.
   ```
3. Save and refresh

### Change Colors
Edit `src/index.css` to customize the theme:
```css
:root {
  --primary: 221 83% 23%;        /* Deep blue */
  --background: 220 13% 95%;     /* Light gray */
}
```

## Testing

Run the linter to check everything is working:
```bash
pnpm run lint
```

Expected output: `Checked 75 files in XXXms. No fixes applied.`

## Troubleshooting

**Application won't start?**
- Make sure Node.js 18+ is installed: `node -v`
- Delete `node_modules` and run `pnpm install` again

**AI not responding?**
- Check your internet connection
- Check browser console for errors
- Verify `.env` file exists with `VITE_APP_ID=app-8984111omept`

**FAQs not loading?**
- Verify `src/data/faqs.md` exists
- Check the Markdown format is correct
- Clear browser cache and refresh

## Next Steps

1. **Try it out** - Ask some questions and see how it works
2. **Add your FAQs** - Replace the sample FAQs with your own content
3. **Customize** - Update colors and branding to match your style
4. **Deploy** - Build for production with `pnpm run build`

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Review the documentation files
3. Verify your internet connection
4. Check that all files are in place

## Summary

✅ **Status**: Fully configured and ready to use
✅ **API**: Pre-integrated (no keys needed)
✅ **Documentation**: Complete
✅ **Build**: Passing all checks
✅ **Action Required**: None - just start using it!

---

**Enjoy your Smart FAQ Bot!** 🚀

Start the application with `pnpm run dev` and begin asking questions.
