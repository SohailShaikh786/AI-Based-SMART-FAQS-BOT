import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send, Bot, User, FileText, Info } from 'lucide-react';
import { parseFAQMarkdown, type FAQ } from '@/utils/faqParser';
import { createFAQEmbeddings, searchSimilarFAQs, type FAQWithEmbedding } from '@/services/embeddingService';
import { generateAnswerStream, getAPIInfo } from '@/services/llmService';
import faqMarkdown from '@/data/faqs.md?raw';
import { Streamdown } from 'streamdown';

// Message interface for chat history
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: FAQ[];
  isStreaming?: boolean;
}

export default function FAQBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [faqsWithEmbeddings, setFaqsWithEmbeddings] = useState<FAQWithEmbedding[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiInfo = getAPIInfo();

  useEffect(() => {
    const faqs = parseFAQMarkdown(faqMarkdown);
    const embeddedFaqs = createFAQEmbeddings(faqs);
    setFaqsWithEmbeddings(embeddedFaqs);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const relevantFAQs = searchSimilarFAQs(userMessage.content, faqsWithEmbeddings, 3);
      
      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        sources: relevantFAQs.map(({ id, question, answer }) => ({ id, question, answer })),
        isStreaming: true
      };

      setMessages(prev => [...prev, assistantMessage]);

      let fullContent = '';
      
      for await (const chunk of generateAnswerStream(userMessage.content, relevantFAQs)) {
        if (chunk.isComplete) {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMessageId
                ? { ...msg, isStreaming: false }
                : msg
            )
          );
          break;
        }

        fullContent += chunk.text;
        
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: fullContent }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error generating answer:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your question. Please try again.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 xl:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 xl:mb-8 text-center">
          <h1 className="text-3xl xl:text-4xl font-bold text-primary mb-2">Smart FAQ Bot</h1>
          <p className="text-muted-foreground">
            Ask me anything about the FAQ system and I'll provide accurate answers
          </p>
        </div>

        <Card className="mb-4 xl:mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Conversation
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span>Powered by Retrieval-Augmented Generation (RAG)</span>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1">
                <Info className="w-3 h-3" />
                {apiInfo.provider} - {apiInfo.model}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto mb-4 p-4 rounded-lg bg-muted/30">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <Bot className="w-16 h-16 text-primary mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Welcome to Smart FAQ Bot</h3>
                  <p className="text-muted-foreground max-w-md">
                    Start by asking a question about the FAQ system, embeddings, RAG, or how this application works.
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div className={`flex flex-col gap-2 max-w-[80%]`}>
                    <div
                      className={`rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border border-border'
                      }`}
                    >
                      {message.role === 'assistant' && message.content ? (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <Streamdown mode="static">{message.content}</Streamdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                      
                      {message.isStreaming && (
                        <Loader2 className="w-4 h-4 animate-spin mt-2" />
                      )}
                    </div>

                    {message.sources && message.sources.length > 0 && (
                      <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2 border border-border">
                        <div className="flex items-center gap-1 mb-1 font-semibold">
                          <FileText className="w-3 h-3" />
                          <span>Sources ({message.sources.length} FAQs retrieved):</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1">
                          {message.sources.map((source, idx) => (
                            <li key={idx}>{source.question}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-accent-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about the FAQ system..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="font-semibold mb-2 text-primary">1. Semantic Search</div>
                <p className="text-sm text-muted-foreground">
                  Your question is converted to embeddings and matched against the FAQ knowledge base
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="font-semibold mb-2 text-primary">2. Context Retrieval</div>
                <p className="text-sm text-muted-foreground">
                  The most relevant FAQs are retrieved and provided as context
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="font-semibold mb-2 text-primary">3. AI Generation</div>
                <p className="text-sm text-muted-foreground">
                  The AI model generates an accurate answer based on the retrieved context
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
