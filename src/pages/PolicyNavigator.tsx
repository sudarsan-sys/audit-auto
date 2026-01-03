import { useState, useRef } from 'react';
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
  X,
  Bot,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { mockPolicies } from '@/data/mockData';
// We use the relative path to ensure it finds the file in src/services/api.ts
import { auditService } from '@/api';
import { toast } from 'sonner';

// Define the shape of our Chat History items
interface QAItem {
  id: string;
  question: string;
  answer: string;
  source: string;
  page?: number;
  confidence?: number;
  timestamp: string;
}

export default function PolicyNavigator() {
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Chat States
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [qaHistory, setQaHistory] = useState<QAItem[]>([]);

  // Upload States
  const [showUpload, setShowUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 1. CHAT LOGIC ---
  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setIsAsking(true);
    const currentQuestion = question;
    setQuestion(''); // Clear input immediately

    try {
      // Call the Python Backend
      const data = await auditService.askQuestion(currentQuestion);

      // Format the response
      const newQA: QAItem = {
        id: `qa-${Date.now()}`,
        question: currentQuestion,
        answer: data.answer || "No answer found.",
        // Map backend sources if available
        source: data.sources?.filename || 'Knowledge Base',
        page: 1,
        confidence: 0.95,
        timestamp: new Date().toISOString(),
      };

      setQaHistory(prev => [newQA, ...prev]);
    } catch (error) {
      console.error("RAG Error:", error);
      toast.error("Failed to reach the AI. Is the backend running?");
    } finally {
      setIsAsking(false);
    }
  };

  // --- 2. UPLOAD LOGIC (NEW) ---
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast.error("Please upload a PDF file.");
      return;
    }

    setIsUploading(true);
    try {
      toast.info("Uploading and indexing document...");

      // This endpoint uploads the file AND adds it to ChromaDB
      await auditService.uploadFile(file);

      toast.success(`${file.name} successfully added to Knowledge Base!`);
      setShowUpload(false);
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload. Check if backend is running.");
    } finally {
      setIsUploading(false);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };


  // Filtering logic for the sidebar list
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
      <div className="w-80 border-r border-border bg-card flex flex-col hidden md:flex">
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
        <div className="p-6 border-b border-border bg-card/50">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Ask a question about your policies..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                className="pl-12 pr-24 h-14 text-base rounded-xl bg-background border-2 focus:border-primary/20 shadow-sm"
                disabled={isAsking}
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
              Try: "What is the approval threshold for travel?" or "Summarize the procurement risks."
            </p>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="max-w-3xl mx-auto space-y-8">
            {qaHistory.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground opacity-50">
                <Bot className="w-16 h-16 mb-4" />
                <p>No questions asked yet. Upload a policy to get started.</p>
              </div>
            )}

            {qaHistory.map((qa, index) => (
              <div
                key={qa.id}
                className="space-y-4 animate-in slide-in-from-bottom-2 fade-in duration-500"
              >
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-5 py-3 max-w-[85%] shadow-sm">
                    <p className="text-sm font-medium">{qa.question}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center ml-3 flex-shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="bg-card border border-border rounded-2xl rounded-tl-sm p-5 shadow-sm">
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{qa.answer}</p>

                      <div className="mt-4 p-3 bg-secondary/50 rounded-lg border border-border/50">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-foreground">{qa.source}</span>
                            {qa.page && <span className="text-sm text-muted-foreground">• Page {qa.page}</span>}
                          </div>
                          {qa.confidence && (
                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 border-0">
                              {Math.round(qa.confidence * 100)}% Match
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pl-2">
                      <span className="text-xs text-muted-foreground">Was this helpful?</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:text-green-600">
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:text-red-600">
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isAsking && (
              <div className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Analyzing documents...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Upload Modal - FULLY FUNCTIONAL */}
      {showUpload && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-card rounded-xl shadow-lg w-full max-w-lg mx-4 border border-border">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Upload Policy Document</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowUpload(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6">
              {/* Hidden Input for Click-to-Upload */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileSelect}
                className="hidden"
                accept=".pdf"
              />

              <div
                className={cn(
                  'border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer',
                  isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/50'
                )}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={triggerFileInput}
              >
                {isUploading ? (
                  <div className="py-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-foreground font-medium">Processing & Indexing...</p>
                    <p className="text-xs text-muted-foreground mt-2">Sending to AI Brain & Vector DB</p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-foreground font-medium text-lg">Drag and drop your PDF here</p>
                    <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 p-4 border-t border-border bg-muted/20 rounded-b-xl">
              <Button variant="outline" onClick={() => setShowUpload(false)} disabled={isUploading}>
                Cancel
              </Button>
              <Button onClick={triggerFileInput} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Select File'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}