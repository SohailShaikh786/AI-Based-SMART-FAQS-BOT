export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export function parseFAQMarkdown(markdown: string): FAQ[] {
  const faqs: FAQ[] = [];
  const lines = markdown.split('\n');
  
  let currentQuestion = '';
  let currentAnswer = '';
  let isReadingAnswer = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('## ') && !line.startsWith('###')) {
      if (currentQuestion && currentAnswer) {
        faqs.push({
          id: generateId(currentQuestion),
          question: currentQuestion,
          answer: currentAnswer.trim()
        });
      }
      
      currentQuestion = line.replace('## ', '').trim();
      currentAnswer = '';
      isReadingAnswer = true;
    } else if (isReadingAnswer && line && !line.startsWith('#')) {
      currentAnswer += line + '\n';
    }
  }
  
  if (currentQuestion && currentAnswer) {
    faqs.push({
      id: generateId(currentQuestion),
      question: currentQuestion,
      answer: currentAnswer.trim()
    });
  }
  
  return faqs;
}

function generateId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
