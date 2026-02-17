import { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Play,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  Eye,
  X,
  ArrowLeft,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockTransactions } from '@/data/mockData';
// Use relative path to ensure we find the service
import { auditService, AuditResult } from '@/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function TransactionSentinel() {
  // Dashboard States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<typeof mockTransactions[0] | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Upload & Real Audit States
  const [showUpload, setShowUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null); // Stores real backend result
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- REAL BACKEND UPLOAD LOGIC ---
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Check file type (PDF, CSV, Excel)
    const validMimeTypes = [
      'application/pdf',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    // Also check extensions as fallback since MIME types can vary by OS
    const validExtensions = ['.pdf', '.csv', '.xlsx', '.xls'];
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!validMimeTypes.includes(file.type) && !hasValidExtension) {
      toast.error("Please upload a PDF, CSV, or Excel file for auditing.");
      return;
    }

    setIsUploading(true);
    try {
      toast.info("Uploading file for analysis...");
      // Call Backend
      const data = await auditService.uploadFile(file);

      setAuditResult(data); // Save result to switch view
      setShowUpload(false); // Close modal
      toast.success("Analysis Complete!");
    } catch (error) {
      console.error("Analysis failed", error);
      toast.error("Analysis failed. Check backend console.");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
  };

  // --- VIEW 1: REAL AUDIT REPORT (If file uploaded) ---
  if (auditResult) {
    return (
      <div className="container mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setAuditResult(null)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Audit Results</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Summary Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-primary" />
                  <CardTitle>{auditResult.filename}</CardTitle>
                </div>
                <div className={`px-4 py-1 rounded-full text-sm font-bold border ${auditResult.status === 'PASSED'
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : auditResult.status === 'WARNING'
                      ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                      : 'bg-red-100 text-red-700 border-red-200'
                  }`}>
                  {auditResult.status} (Score: {auditResult.score})
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {auditResult.summary}
              </p>
            </CardContent>
          </Card>

          {/* Risks */}
          <Card className="border-red-100 bg-red-50/10">
            <CardHeader>
              <CardTitle className="flex items-center text-red-700">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Identified Risks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-sm text-red-900">
                {auditResult.risks.map((risk, i) => (
                  <li key={i}>{risk}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="border-blue-100 bg-blue-50/10">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-700">
                <CheckCircle className="mr-2 h-5 w-5" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-sm text-blue-900">
                {auditResult.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // --- VIEW 2: MOCK DASHBOARD (Default) ---
  const anomalies = mockTransactions.filter(t => t.issueType !== null);
  const filteredTransactions = anomalies.filter(t => {
    if (severityFilter !== 'all' && t.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const severityBadge = (severity: string | null) => {
    switch (severity) {
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-0">Medium</Badge>;
      case 'low': return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-0">Low</Badge>;
      default: return null;
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transaction Sentinel</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered anomaly detection for financial transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowUpload(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Data
          </Button>
          <Button onClick={() => setIsAnalyzing(true)} disabled={isAnalyzing}>
            {isAnalyzing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</> : <><Play className="w-4 h-4 mr-2" /> Run Analysis</>}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
          <p className="text-sm text-muted-foreground">Total Transactions</p>
          <p className="text-2xl font-bold text-foreground mt-1">{mockTransactions.length}</p>
        </div>
        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
          <p className="text-sm text-muted-foreground">Anomalies Detected</p>
          <p className="text-2xl font-bold text-destructive mt-1">{anomalies.length}</p>
        </div>
        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
          <p className="text-sm text-muted-foreground">High Severity</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {anomalies.filter(a => a.severity === 'high').length}
          </p>
        </div>
        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
          <p className="text-sm text-muted-foreground">Resolved</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {anomalies.filter(a => a.status === 'resolved').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filters:</span>
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Severity" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1" />
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <ScrollArea className="max-h-[500px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-28">ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Issue Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedTransaction(transaction)}
                >
                  <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell className="font-medium">{transaction.vendor}</TableCell>
                  <TableCell className="text-right font-medium">${transaction.amount.toLocaleString()}</TableCell>
                  <TableCell><Badge variant="outline">{transaction.issueType}</Badge></TableCell>
                  <TableCell>{severityBadge(transaction.severity)}</TableCell>
                  <TableCell><span className="capitalize text-sm">{transaction.status}</span></TableCell>
                  <TableCell><Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Upload Modal (Connected to Backend) */}
      {showUpload && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200 p-4">
          <div className="bg-card rounded-xl shadow-lg w-full max-w-lg animate-in slide-in-from-bottom-10 border">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-foreground">Upload for Real Audit</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowUpload(false)} disabled={isUploading}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileSelect}
                className="hidden"
                accept=".pdf,.csv,.xlsx,.xls"
              />

              <div
                className={cn(
                  "border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer",
                  isUploading && "opacity-50 pointer-events-none"
                )}
                onClick={triggerFileInput}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                    <p className="font-medium">Auditing Document...</p>
                    <p className="text-sm text-muted-foreground">Sending to Gemini AI</p>
                  </div>
                ) : (
                  <>
                    <FileSpreadsheet className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                    <p className="text-foreground font-medium">Click to Upload PDF or CSV</p>
                    <p className="text-sm text-muted-foreground mt-1">We will audit it instantly</p>
                  </>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 p-4 border-t bg-muted/20 rounded-b-xl">
              <Button variant="outline" onClick={() => setShowUpload(false)} disabled={isUploading}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}