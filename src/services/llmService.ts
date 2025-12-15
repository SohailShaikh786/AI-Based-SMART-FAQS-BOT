import type { FAQ } from '@/utils/faqParser';

// API Configuration
// Supports two modes:
// 1. MCP Integration (default) - Pre-configured Gemini 2.5 Flash
// 2. Direct Groq API - Set VITE_GROQ_API_KEY in .env file

const APP_ID = import.meta.env.VITE_APP_ID || 'app-8984111omept';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Use Groq API if key is provided and not placeholder, otherwise use MCP integration
const USE_GROQ = GROQ_API_KEY && GROQ_API_KEY !== 'your_api_key_here';

const MCP_API_URL = 'https://api-integrations.appmedo.com/app-8984111omept/api-rLob8RdzAOl9/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface LLMMessage {
  role: 'user' | 'model' | 'assistant' | 'system';
  parts?: Array<{ text: string }>;
  content?: string;
}

export interface StreamChunk {
  text: string;
  isComplete: boolean;
}

// Helper function to check which API is being used
export function getAPIInfo(): { provider: string; model: string; configured: boolean } {
  if (USE_GROQ) {
    return {
      provider: 'Groq',
      model: 'llama-3.3-70b-versatile',
      configured: true
    };
  }
  return {
    provider: 'MCP Integration',
    model: 'Gemini 2.5 Flash',
    configured: true
  };
}

export async function* generateAnswerStream(
  userQuestion: string,
  relevantFAQs: FAQ[]
): AsyncGenerator<StreamChunk, void, unknown> {
  const context = relevantFAQs
    .map((faq, index) => `FAQ ${index + 1}:\nQ: ${faq.question}\nA: ${faq.answer}`)
    .join('\n\n');

  const systemPrompt = `You are a helpful FAQ assistant. Answer the user's question based ONLY on the following FAQ information. If the question cannot be answered from the FAQs provided, politely say so and suggest they rephrase their question.

Available FAQs:
${context}

Instructions:
- Provide clear, accurate answers based on the FAQ content
- Be concise but comprehensive
- If multiple FAQs are relevant, synthesize the information
- Always stay grounded in the provided FAQ content`;

  if (USE_GROQ) {
    yield* generateGroqStream(userQuestion, systemPrompt);
  } else {
    yield* generateMCPStream(userQuestion, systemPrompt);
  }
}

// Groq API streaming implementation
async function* generateGroqStream(
  userQuestion: string,
  systemPrompt: string
): AsyncGenerator<StreamChunk, void, unknown> {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuestion }
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorMessage = response.status === 401 
        ? 'Groq API authentication failed. Please check your API key in the .env file.'
        : response.status === 429
        ? 'Too many requests. Please wait a moment and try again.'
        : response.status === 500
        ? 'The AI service is temporarily unavailable. Please try again later.'
        : `API request failed with status ${response.status}`;
      
      throw new Error(errorMessage);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        yield { text: '', isComplete: true };
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          
          if (data === '[DONE]') {
            yield { text: '', isComplete: true };
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            
            if (content) {
              yield { text: content, isComplete: false };
            }
          } catch (e) {
            console.error('Error parsing Groq SSE data:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in generateGroqStream:', error);
    throw error;
  }
}

// MCP API streaming implementation (original)
async function* generateMCPStream(
  userQuestion: string,
  systemPrompt: string
): AsyncGenerator<StreamChunk, void, unknown> {
  const messages: LLMMessage[] = [
    {
      role: 'user',
      parts: [{ text: systemPrompt }]
    },
    {
      role: 'model',
      parts: [{ text: 'I understand. I will answer questions based only on the provided FAQ information.' }]
    },
    {
      role: 'user',
      parts: [{ text: userQuestion }]
    }
  ];

  try {
    const response = await fetch(MCP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Id': APP_ID
      },
      body: JSON.stringify({
        contents: messages
      })
    });

    if (!response.ok) {
      const errorMessage = response.status === 401 
        ? 'API authentication failed. Please check your configuration.'
        : response.status === 429
        ? 'Too many requests. Please wait a moment and try again.'
        : response.status === 500
        ? 'The AI service is temporarily unavailable. Please try again later.'
        : `API request failed with status ${response.status}`;
      
      throw new Error(errorMessage);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        yield { text: '', isComplete: true };
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            yield { text: '', isComplete: true };
            return;
          }

          try {
            const parsed = JSON.parse(data);
            
            if (parsed.candidates && parsed.candidates[0]?.content?.parts) {
              const text = parsed.candidates[0].content.parts[0]?.text || '';
              if (text) {
                yield { text, isComplete: false };
              }
            }
          } catch (e) {
            console.error('Error parsing MCP SSE data:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in generateMCPStream:', error);
    throw error;
  }
}
