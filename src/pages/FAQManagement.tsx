import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Download, Upload } from 'lucide-react';
import { parseFAQMarkdown, type FAQ } from '@/utils/faqParser';
import faqMarkdown from '@/data/faqs.md?raw';
import { useToast } from '@/hooks/use-toast';

export default function FAQManagement() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const parsedFaqs = parseFAQMarkdown(faqMarkdown);
    setFaqs(parsedFaqs);
  }, []);

  const handleSave = () => {
    if (!question.trim() || !answer.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Both question and answer are required',
        variant: 'destructive'
      });
      return;
    }

    if (editingFaq) {
      setFaqs(prev =>
        prev.map(faq =>
          faq.id === editingFaq.id
            ? { ...faq, question: question.trim(), answer: answer.trim() }
            : faq
        )
      );
      toast({
        title: 'Success',
        description: 'FAQ updated successfully'
      });
    } else {
      const newFaq: FAQ = {
        id: Date.now().toString(),
        question: question.trim(),
        answer: answer.trim()
      };
      setFaqs(prev => [...prev, newFaq]);
      toast({
        title: 'Success',
        description: 'FAQ added successfully'
      });
    }

    resetForm();
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setFaqs(prev => prev.filter(faq => faq.id !== id));
    toast({
      title: 'Success',
      description: 'FAQ deleted successfully'
    });
  };

  const resetForm = () => {
    setQuestion('');
    setAnswer('');
    setEditingFaq(null);
    setIsDialogOpen(false);
  };

  const exportToMarkdown = () => {
    const markdown = faqs
      .map(faq => `## ${faq.question}\n\n${faq.answer}`)
      .join('\n\n');
    
    const fullMarkdown = `# FAQ Knowledge Base\n\n${markdown}`;
    
    const blob = new Blob([fullMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'faqs.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Success',
      description: 'FAQs exported to Markdown file'
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const parsedFaqs = parseFAQMarkdown(content);
      setFaqs(parsedFaqs);
      toast({
        title: 'Success',
        description: `Imported ${parsedFaqs.length} FAQs`
      });
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-background p-4 xl:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 xl:mb-8">
          <h1 className="text-3xl xl:text-4xl font-bold text-primary mb-2">FAQ Management</h1>
          <p className="text-muted-foreground">
            Manage your FAQ knowledge base - add, edit, or remove questions and answers
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              <div>
                <CardTitle>FAQ Database</CardTitle>
                <CardDescription>
                  {faqs.length} {faqs.length === 1 ? 'FAQ' : 'FAQs'} in the knowledge base
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => resetForm()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add FAQ
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingFaq
                          ? 'Update the question and answer below'
                          : 'Enter the question and answer for the new FAQ'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Question</label>
                        <Input
                          value={question}
                          onChange={(e) => setQuestion(e.target.value)}
                          placeholder="Enter the FAQ question..."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Answer</label>
                        <Textarea
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder="Enter the FAQ answer..."
                          rows={6}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={resetForm}>
                          Cancel
                        </Button>
                        <Button onClick={handleSave}>
                          {editingFaq ? 'Update' : 'Add'} FAQ
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" onClick={exportToMarkdown}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>

                <Button variant="outline" asChild>
                  <label className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                    <input
                      type="file"
                      accept=".md,.markdown"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Question</TableHead>
                    <TableHead className="w-[45%]">Answer</TableHead>
                    <TableHead className="w-[15%] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faqs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        No FAQs found. Add your first FAQ to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    faqs.map((faq) => (
                      <TableRow key={faq.id}>
                        <TableCell className="font-medium">{faq.question}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {faq.answer.length > 100
                            ? `${faq.answer.substring(0, 100)}...`
                            : faq.answer}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(faq)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(faq.id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
              <h3 className="font-semibold mb-2 text-sm">💡 Note about Embedding Regeneration</h3>
              <p className="text-sm text-muted-foreground">
                In a production environment, changes to FAQs would automatically trigger embedding regeneration
                to ensure accurate semantic search. This demo uses a static FAQ file for simplicity.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
