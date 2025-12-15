import type { FAQ } from '@/utils/faqParser';

// Embedding Service
// This service handles semantic search using simple text-based embeddings
// For production use, consider using advanced embedding models like OpenAI or Cohere

export interface FAQWithEmbedding extends FAQ {
  embedding: number[];
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0);
}

function createSimpleEmbedding(text: string): number[] {
  const tokens = tokenize(text);
  const vocabulary = new Set<string>();
  
  tokens.forEach(token => vocabulary.add(token));
  
  const embedding = new Array(100).fill(0);
  
  tokens.forEach((token, index) => {
    const hash = simpleHash(token);
    const position = hash % 100;
    embedding[position] += 1 / (index + 1);
  });
  
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => magnitude > 0 ? val / magnitude : 0);
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function cosineSimilarity(vec1: number[], vec2: number[]): number {
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;
  
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }
  
  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);
  
  if (mag1 === 0 || mag2 === 0) return 0;
  return dotProduct / (mag1 * mag2);
}

export function createFAQEmbeddings(faqs: FAQ[]): FAQWithEmbedding[] {
  return faqs.map(faq => ({
    ...faq,
    embedding: createSimpleEmbedding(faq.question + ' ' + faq.answer)
  }));
}

export function searchSimilarFAQs(
  query: string,
  faqsWithEmbeddings: FAQWithEmbedding[],
  topK = 3
): Array<FAQWithEmbedding & { similarity: number }> {
  const queryEmbedding = createSimpleEmbedding(query);
  
  const results = faqsWithEmbeddings.map(faq => ({
    ...faq,
    similarity: cosineSimilarity(queryEmbedding, faq.embedding)
  }));
  
  results.sort((a, b) => b.similarity - a.similarity);
  
  return results.slice(0, topK);
}
