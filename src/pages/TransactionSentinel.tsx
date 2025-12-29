import { useState } from 'react';
import { 
  Upload, 
  FileSpreadsheet, 
  Play, 
  Filter, 
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown,
  X,
  Loader2,
  Eye
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
import { cn } from '@/lib/utils';
import { mockTransactions } from '@/data/mockData';

export default function TransactionSentinel() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<typeof mockTransactions[0] | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showUpload, setShowUpload] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }, 3000);
  };

  const anomalies = mockTransactions.filter(t => t.issueType !== null);
  
  const filteredTransactions = anomalies.filter(t => {
    if (severityFilter !== 'all' && t.severity !== severityFilter) return false;
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const severityBadge = (severity: string | null) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'low':
        return <Badge variant="info">Low</Badge>;
      default:
        return null;
    }
  };

  const issueTypeBadge = (type: string | null) => {
    switch (type) {
      case 'Policy Violation':
        return <Badge variant="destructive" className="text-xs">Policy Violation</Badge>;
      case 'Semantic Anomaly':
        return <Badge variant="warning" className="text-xs">Semantic Anomaly</Badge>;
      case 'Pattern Alert':
        return <Badge variant="info" className="text-xs">Pattern Alert</Badge>;
      default:
        return null;
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'reviewed':
        return <Clock className="w-4 h-4 text-info" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-success" />;
      default:
        return null;
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
          <Button onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Analysis
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Transactions</p>
          <p className="text-2xl font-bold text-foreground mt-1">{mockTransactions.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Anomalies Detected</p>
          <p className="text-2xl font-bold text-destructive mt-1">{anomalies.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">High Severity</p>
          <p className="text-2xl font-bold text-warning mt-1">
            {anomalies.filter(a => a.severity === 'high').length}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Resolved</p>
          <p className="text-2xl font-bold text-success mt-1">
            {anomalies.filter(a => a.status === 'resolved').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="module-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filters:</span>
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
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
      <div className="module-card overflow-hidden">
        <ScrollArea className="max-h-[500px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
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
                  className="cursor-pointer hover:bg-secondary/30"
                  onClick={() => setSelectedTransaction(transaction)}
                >
                  <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell className="font-medium">{transaction.vendor}</TableCell>
                  <TableCell className="text-right font-medium">
                    ${transaction.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>{issueTypeBadge(transaction.issueType)}</TableCell>
                  <TableCell>{severityBadge(transaction.severity)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {statusIcon(transaction.status)}
                      <span className="capitalize text-sm">{transaction.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-card rounded-xl shadow-lg w-full max-w-2xl animate-slide-up max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-foreground">{selectedTransaction.id}</h3>
                {severityBadge(selectedTransaction.severity)}
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedTransaction(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {/* Transaction Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Vendor</p>
                    <p className="font-medium text-foreground">{selectedTransaction.vendor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium text-foreground text-lg">${selectedTransaction.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium text-foreground">{selectedTransaction.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium text-foreground">{selectedTransaction.department}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium text-foreground">{selectedTransaction.description}</p>
                </div>

                {/* AI Analysis */}
                <div className="p-4 bg-secondary/50 rounded-lg space-y-3">
                  <h4 className="font-medium text-foreground flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    AI Analysis
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed">
                    This transaction was flagged due to a potential {selectedTransaction.issueType?.toLowerCase()}. 
                    The payment amount of ${selectedTransaction.amount.toLocaleString()} exceeds the typical range for 
                    {selectedTransaction.department} department transactions. Historical analysis shows similar 
                    vendor payments averaging $15,000 lower than this transaction.
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <Badge variant="outline">Related Policy: Procurement Guidelines</Badge>
                  </div>
                </div>

                {/* Similar Transactions */}
                <div>
                  <h4 className="font-medium text-foreground mb-3">Similar Historical Transactions</h4>
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-foreground">{selectedTransaction.vendor}</p>
                          <p className="text-xs text-muted-foreground">2023-{12 - i}-15</p>
                        </div>
                        <p className="font-medium text-foreground">
                          ${(selectedTransaction.amount * (0.7 + i * 0.1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="flex justify-end gap-2 p-4 border-t border-border">
              <Button variant="outline" onClick={() => setSelectedTransaction(null)}>
                Mark as False Positive
              </Button>
              <Button variant="outline">Dismiss</Button>
              <Button>Create Finding</Button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-card rounded-xl shadow-lg w-full max-w-lg animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Upload Transaction Data</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowUpload(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                <FileSpreadsheet className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium">Drop your CSV or Excel file here</p>
                <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-2">Required columns:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Date (YYYY-MM-DD)</li>
                  <li>Amount (numeric)</li>
                  <li>Vendor name</li>
                  <li>Description</li>
                  <li>Department (optional)</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t border-border">
              <Button variant="outline" onClick={() => setShowUpload(false)}>Cancel</Button>
              <Button onClick={() => setShowUpload(false)}>Upload & Preview</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
