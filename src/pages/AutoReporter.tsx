import { useState } from 'react';
import { 
  Plus, 
  FileText, 
  Download, 
  Send, 
  Edit2, 
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Filter,
  LayoutGrid,
  List,
  X,
  Save,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { mockFindings } from '@/data/mockData';

type Finding = typeof mockFindings[0];

export default function AutoReporter() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const filteredFindings = mockFindings.filter(f => 
    statusFilter === 'all' || f.status === statusFilter
  );

  const severityBadge = (severity: string) => {
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

  const statusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return (
          <Badge variant="secondary" className="gap-1">
            <Edit2 className="w-3 h-3" />
            Draft
          </Badge>
        );
      case 'under-review':
        return (
          <Badge variant="warning" className="gap-1">
            <Clock className="w-3 h-3" />
            Under Review
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle className="w-3 h-3" />
            Approved
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Auto-Reporter</h1>
          <p className="text-muted-foreground mt-1">
            AI-generated audit findings with CCCE methodology
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Finding
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Total Findings</p>
          <p className="text-2xl font-bold text-foreground mt-1">{mockFindings.length}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Drafts</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {mockFindings.filter(f => f.status === 'draft').length}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Under Review</p>
          <p className="text-2xl font-bold text-warning mt-1">
            {mockFindings.filter(f => f.status === 'under-review').length}
          </p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">Approved</p>
          <p className="text-2xl font-bold text-success mt-1">
            {mockFindings.filter(f => f.status === 'approved').length}
          </p>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="module-card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filter:</span>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1" />
          <div className="flex items-center border border-border rounded-lg p-1">
            <Button 
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Findings Grid/List */}
      <div className={cn(
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-3'
      )}>
        {filteredFindings.map((finding, index) => (
          <div
            key={finding.id}
            className={cn(
              'module-card p-4 cursor-pointer hover:shadow-md transition-shadow animate-slide-up',
              viewMode === 'list' && 'flex items-center gap-4'
            )}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => setSelectedFinding(finding)}
          >
            {viewMode === 'grid' ? (
              <>
                <div className="flex items-start justify-between mb-3">
                  {severityBadge(finding.severity)}
                  {statusBadge(finding.status)}
                </div>
                <h3 className="font-medium text-foreground mb-2 line-clamp-2">
                  {finding.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {finding.condition}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{finding.createdAt}</span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {finding.relatedPolicy}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {severityBadge(finding.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{finding.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{finding.condition}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  {statusBadge(finding.status)}
                  <span className="text-sm text-muted-foreground">{finding.createdAt}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Finding Detail/Editor Modal */}
      {selectedFinding && (
        <div className="fixed inset-0 bg-foreground/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-card rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{selectedFinding.id}</span>
                {severityBadge(selectedFinding.severity)}
                {statusBadge(selectedFinding.status)}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? <Eye className="w-4 h-4 mr-1" /> : <Edit2 className="w-4 h-4 mr-1" />}
                  {isEditing ? 'Preview' : 'Edit'}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => { setSelectedFinding(null); setIsEditing(false); }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6">
                {/* Title */}
                {isEditing ? (
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Finding Title</label>
                    <Input defaultValue={selectedFinding.title} />
                  </div>
                ) : (
                  <h2 className="text-xl font-semibold text-foreground">{selectedFinding.title}</h2>
                )}

                {/* CCCE Sections */}
                <div className="grid gap-6">
                  {/* Condition */}
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                      </div>
                      <h3 className="font-medium text-foreground">Condition</h3>
                      <span className="text-xs text-muted-foreground">What is the issue?</span>
                    </div>
                    {isEditing ? (
                      <Textarea defaultValue={selectedFinding.condition} rows={3} />
                    ) : (
                      <p className="text-sm text-foreground leading-relaxed">{selectedFinding.condition}</p>
                    )}
                  </div>

                  {/* Criteria */}
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <h3 className="font-medium text-foreground">Criteria</h3>
                      <span className="text-xs text-muted-foreground">What policy was violated?</span>
                    </div>
                    {isEditing ? (
                      <Textarea defaultValue={selectedFinding.criteria} rows={3} />
                    ) : (
                      <p className="text-sm text-foreground leading-relaxed">{selectedFinding.criteria}</p>
                    )}
                    <Badge variant="outline" className="mt-3">
                      <FileText className="w-3 h-3 mr-1" />
                      {selectedFinding.relatedPolicy}
                    </Badge>
                  </div>

                  {/* Cause */}
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-warning" />
                      </div>
                      <h3 className="font-medium text-foreground">Cause</h3>
                      <span className="text-xs text-muted-foreground">Why did it happen?</span>
                    </div>
                    {isEditing ? (
                      <Textarea defaultValue={selectedFinding.cause} rows={3} />
                    ) : (
                      <p className="text-sm text-foreground leading-relaxed">{selectedFinding.cause}</p>
                    )}
                  </div>

                  {/* Effect */}
                  <div className="p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-accent" />
                      </div>
                      <h3 className="font-medium text-foreground">Effect</h3>
                      <span className="text-xs text-muted-foreground">What's the impact?</span>
                    </div>
                    {isEditing ? (
                      <Textarea defaultValue={selectedFinding.effect} rows={3} />
                    ) : (
                      <p className="text-sm text-foreground leading-relaxed">{selectedFinding.effect}</p>
                    )}
                  </div>
                </div>

                {/* Related Transactions */}
                <div>
                  <h4 className="font-medium text-foreground mb-3">Related Transactions</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedFinding.relatedTransactions.map((txn) => (
                      <Badge key={txn} variant="outline" className="font-mono">
                        {txn}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Comments Section */}
                <div className="border-t border-border pt-4">
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Comments & Notes
                  </h4>
                  <Textarea placeholder="Add a comment or note..." rows={2} />
                </div>
              </div>
            </ScrollArea>

            <div className="flex justify-between gap-2 p-4 border-t border-border">
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
              <div className="flex gap-2">
                {isEditing && (
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                )}
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  Submit for Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
