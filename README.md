# Welcome to  Project
# Smart FAQ Bot

An intelligent FAQ system powered by Retrieval-Augmented Generation (RAG) that provides accurate, context-aware answers to user questions using AI.


https://github.com/user-attachments/assets/fa11e840-1492-479c-91f8-0009cd848cc3



## Features

- **Intelligent Question Answering**: Ask questions in natural language and receive accurate answers
- **Semantic Search**: Advanced similarity matching to find the most relevant FAQs
- **Dual AI Support**: Choose between MCP Integration (Gemini 2.5 Flash) or Groq API (Llama 3.3 70B)
- **Real-time Streaming**: See answers appear in real-time as they're generated
- **FAQ Management**: Add, edit, delete, and organize your FAQ knowledge base
- **Import/Export**: Backup and restore FAQs using Markdown files

## Quick Start

### Prerequisites
- Node.js 18+ and pnpm installed
- Modern web browser

### Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   
   The application supports two API modes:
   
   **Option 1: MCP Integration (Default - No Setup Required)**
   ```env
   VITE_APP_ID=app-8984111omept
   VITE_GROQ_API_KEY=your_api_key_here
   ```
   Uses pre-integrated Gemini 2.5 Flash API. Works immediately!
   
   **Option 2: Groq API (Optional)**
   ```env
   VITE_APP_ID=app-8984111omept
   VITE_GROQ_API_KEY=gsk_your_actual_key_here
   ```
   Get your free API key from [Groq Console](https://console.groq.com/keys)

3. **Start Development**
   ```bash
   npm run dev
   ```

4. **Validate Build**
   ```bash
   npm run lint
   ```

## API Configuration

The application automatically detects which API to use:
- **With Groq API Key**: Uses Groq (Llama 3.3 70B Versatile)
- **Without Groq API Key**: Uses MCP Integration (Gemini 2.5 Flash)

Check the badge in the conversation card to see which API is active.

For detailed configuration instructions, see [API_CONFIGURATION.md](./API_CONFIGURATION.md)

## Usage

### Asking Questions
1. Navigate to the home page (FAQ Bot)
2. Check the API badge to see which model is active
3. Type your question and press Enter
3. View the AI-generated answer with source FAQs

### Managing FAQs
1. Go to "FAQ Management" page
2. Add, edit, or delete FAQs
3. Export/Import FAQs as Markdown files

## Project Info

## Project Directory

```
├── README.md # Documentation
├── components.json # Component library configuration
├── eslint.config.js # ESLint configuration
├── index.html # Entry file
├── package.json # Package management
├── postcss.config.js # PostCSS configuration
├── public # Static resources directory
│   ├── favicon.png # Icon
│   └── images # Image resources
├── src # Source code directory
│   ├── App.tsx # Entry file
│   ├── components # Components directory
│   ├── context # Context directory
│   ├── db # Database configuration directory
│   ├── hooks # Common hooks directory
│   ├── index.css # Global styles
│   ├── layout # Layout directory
│   ├── lib # Utility library directory
│   ├── main.tsx # Entry file
│   ├── routes.tsx # Routing configuration
│   ├── pages # Pages directory
│   ├── services # Database interaction directory
│   ├── types # Type definitions directory
├── tsconfig.app.json # TypeScript frontend configuration file
├── tsconfig.json # TypeScript configuration file
├── tsconfig.node.json # TypeScript Node.js configuration file
└── vite.config.ts # Vite configuration file
```

## Tech Stack

Vite, TypeScript, React, Supabase

## Development Guidelines

### How to edit code locally?

You can choose [VSCode](https://code.visualstudio.com/Download) or any IDE you prefer. The only requirement is to have Node.js and npm installed.

### Environment Requirements

```
# Node.js ≥ 20
# npm ≥ 10
Example:
# node -v   # v20.18.3
# npm -v    # 10.8.2
```

### Installing Node.js on Windows

```
# Step 1: Visit the Node.js official website: https://nodejs.org/, click download. The website will automatically suggest a suitable version (32-bit or 64-bit) for your system.
# Step 2: Run the installer: Double-click the downloaded installer to run it.
# Step 3: Complete the installation: Follow the installation wizard to complete the process.
# Step 4: Verify installation: Open Command Prompt (cmd) or your IDE terminal, and type `node -v` and `npm -v` to check if Node.js and npm are installed correctly.
```

### Installing Node.js on macOS

```
# Step 1: Using Homebrew (Recommended method): Open Terminal. Type the command `brew install node` and press Enter. If Homebrew is not installed, you need to install it first by running the following command in Terminal:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
Alternatively, use the official installer: Visit the Node.js official website. Download the macOS .pkg installer. Open the downloaded .pkg file and follow the prompts to complete the installation.
# Step 2: Verify installation: Open Command Prompt (cmd) or your IDE terminal, and type `node -v` and `npm -v` to check if Node.js and npm are installed correctly.
```

### After installation, follow these steps:

```
# Step 1: Download the code package
# Step 2: Extract the code package
# Step 3: Open the code package with your IDE and navigate into the code directory
# Step 4: In the IDE terminal, run the command to install dependencies: npm i
# Step 5: In the IDE terminal, run the command to start the development server: npm run dev -- --host 127.0.0.1
# Step 6: if step 5 failed, try this command to start the development server: npx vite --host 127.0.0.1
```

