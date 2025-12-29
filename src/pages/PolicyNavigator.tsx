import { useState } from 'react';
import { 
  Search, 
  Upload, 
  FileText, 
  FileType, 
  ThumbsUp, 
  ThumbsDown, 
  Send,
  Filter,
  ChevronRight,
  Loader2,
  CheckCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { mockPolicies, mockQAHistory } from '@/data/mockData';

export default function PolicyNavigator() {
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [qaHistory, setQaHistory] = useState(mockQAHistory);
  const [showUpload, setShowUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleAskQuestion = () => {
    if (!question.trim()) return;
    setIsAsking(true);
    
    // Simulate AI response
    setTimeout(() => {
      const newQA = {
        id: `qa-${Date.now()}`,
        question: question,
        answer: 'Based on the policy documents, the answer to your question involves reviewing Section 4.2 of the Procurement Guidelines which outlines the approval thresholds and required documentation for vendor payments. Specifically, all payments above $25,000 require competitive bidding.',
        source: 'Procurement Guidelines',
        page: 15,
        confidence: 0.91,
        timestamp: new Date().toISOString(),
      };
      setQaHistory([newQA, ...qaHistory]);
      setQuestion('');
      setIsAsking(false);
    }, 2000);
  };

  const filteredPolicies = mockPolicies.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryColors: Record<string, string> = {
    'Financial': 'bg-primary/10 text-primary',
    'HR': 'bg-success/10 text-success',
    'IT Security': 'bg-destructive/10 text-destructive',
    'Compliance': 'bg-warning/10 text-warning',
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar - Policy List */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
          <Button 
            className="w-full gap-2" 
            onClick={() => setShowUpload(true)}
          >
            <Upload className="w-4 h-4" />
            Upload Policy
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredPolicies.map((policy) => (
              <button
                key={policy.id}
                onClick={() => setSelectedPolicy(policy.id)}
                className={cn(
                  'w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors',
                  selectedPolicy === policy.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-secondary'
                )}
              >
                <div className={cn(
                  'p-2 rounded-lg',
                  policy.type === 'pdf' ? 'bg-destructive/10' : 'bg-info/10'
                )}>
                  {policy.type === 'pdf' ? (
                    <FileText className="w-4 h-4 text-destructive" />
                  ) : (
                    <FileType className="w-4 h-4 text-info" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">
                    {policy.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      categoryColors[policy.category] || 'bg-secondary text-secondary-foreground'
                    )}>
                      {policy.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {policy.pages} pages
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground mt-1" />
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content - Q&A Interface */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Search Bar */}
        <div className="p-6 border-b border-border">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Ask a question about your policies..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                className="pl-12 pr-24 h-14 text-base rounded-xl bg-card border-2 focus:border-accent"
              />
              <Button 
                className="absolute right-2 top-1/2 -translate-y-1/2 gap-2"
                onClick={handleAskQuestion}
                disabled={isAsking || !question.trim()}
              >
                {isAsking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Ask
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Try: "What is the approval threshold for travel expenses?"
            </p>
          </div>
        </div>

        {/* Q&A History */}
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {qaHistory.map((qa, index) => (
              <div 
                key={qa.id} 
                className="space-y-4 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Question */}
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-md px-4 py-3 max-w-[80%]">
                    <p className="text-sm">{qa.question}</p>
                  </div>
                </div>

                {/* Answer */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-accent" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="bg-card border border-border rounded-2xl rounded-tl-md p-4">
                      <p className="text-sm text-foreground leading-relaxed">{qa.answer}</p>
                      
                      {/* Source Citation */}
                      <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-foreground">{qa.source}</span>
                            <span className="text-sm text-muted-foreground">• Page {qa.page}</span>
                          </div>
                          <Badge variant="success" className="text-xs">
                            {Math.round(qa.confidence * 100)}% confident
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Feedback */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Was this helpful?</span>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-card rounded-xl shadow-lg w-full max-w-lg mx-4 animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Upload Policy Document</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowUpload(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6">
              <div 
                className={cn(
                  'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
                  isDragging ? 'border-accent bg-accent/5' : 'border-border'
                )}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={() => { setIsDragging(false); setShowUpload(false); }}
              >
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium">Drag and drop your file here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
                <p className="text-xs text-muted-foreground mt-4">Supports PDF, DOCX (Max 50MB)</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-border">
              <Button variant="outline" onClick={() => setShowUpload(false)}>Cancel</Button>
              <Button>Upload</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
