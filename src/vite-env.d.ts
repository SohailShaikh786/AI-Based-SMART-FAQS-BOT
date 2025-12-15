/// <reference types="vite/client" />

declare module '*.md?raw' {
  const content: string;
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_APP_ID: string;
  readonly VITE_GROQ_API_KEY: string;
  readonly VITE_API_KEY: string;
  readonly VITE_ORIGINAL_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
