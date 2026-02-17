// Mock Policy Documents
export const mockPolicies = [
  { id: '1', name: 'Travel & Expense Policy', type: 'pdf', category: 'Financial', pages: 45, uploadedAt: '2024-01-15', status: 'active' },
  { id: '2', name: 'Procurement Guidelines', type: 'docx', category: 'Financial', pages: 32, uploadedAt: '2024-01-10', status: 'active' },
  { id: '3', name: 'IT Security Policy', type: 'pdf', category: 'IT Security', pages: 78, uploadedAt: '2024-01-08', status: 'active' },
  { id: '4', name: 'Employee Handbook', type: 'pdf', category: 'HR', pages: 120, uploadedAt: '2024-01-05', status: 'active' },
  { id: '5', name: 'Data Retention Guidelines', type: 'docx', category: 'Compliance', pages: 28, uploadedAt: '2024-01-03', status: 'active' },
  { id: '6', name: 'Vendor Management Policy', type: 'pdf', category: 'Financial', pages: 35, uploadedAt: '2024-01-01', status: 'active' },
];

// Mock Transactions with Anomalies
export const mockTransactions = [
  { id: 'TXN-001', date: '2024-01-20', vendor: 'Office Supplies Co.', amount: 2450.00, department: 'Marketing', description: 'Office supplies Q1', issueType: null, severity: null, status: 'clean' },
  { id: 'TXN-002', date: '2024-01-19', vendor: 'TechPro Solutions', amount: 15750.00, department: 'IT', description: 'Software licenses', issueType: 'Policy Violation', severity: 'high', status: 'new' },
  { id: 'TXN-003', date: '2024-01-18', vendor: 'Global Travel Inc.', amount: 8900.00, department: 'Sales', description: 'Travel expenses - client meeting', issueType: 'Pattern Alert', severity: 'medium', status: 'reviewed' },
  { id: 'TXN-004', date: '2024-01-17', vendor: 'Marketing Masters LLC', amount: 45000.00, department: 'Marketing', description: 'Q1 campaign services', issueType: 'Semantic Anomaly', severity: 'high', status: 'new' },
  { id: 'TXN-005', date: '2024-01-16', vendor: 'Cloud Services Pro', amount: 3200.00, department: 'IT', description: 'Monthly cloud hosting', issueType: null, severity: null, status: 'clean' },
  { id: 'TXN-006', date: '2024-01-15', vendor: 'Premium Catering', amount: 1850.00, department: 'HR', description: 'Team building event', issueType: 'Policy Violation', severity: 'low', status: 'resolved' },
  { id: 'TXN-007', date: '2024-01-14', vendor: 'Strategic Consulting', amount: 75000.00, department: 'Executive', description: 'Strategy consultation', issueType: 'Pattern Alert', severity: 'high', status: 'new' },
  { id: 'TXN-008', date: '2024-01-13', vendor: 'Office Furniture Plus', amount: 12500.00, department: 'Operations', description: 'New workstations', issueType: null, severity: null, status: 'clean' },
  { id: 'TXN-009', date: '2024-01-12', vendor: 'DataSecure Ltd.', amount: 28000.00, department: 'IT', description: 'Security audit services', issueType: 'Semantic Anomaly', severity: 'medium', status: 'reviewed' },
  { id: 'TXN-010', date: '2024-01-11', vendor: 'Express Logistics', amount: 4500.00, department: 'Operations', description: 'Shipping services', issueType: null, severity: null, status: 'clean' },
  { id: 'TXN-011', date: '2024-01-10', vendor: 'TechPro Solutions', amount: 18500.00, department: 'IT', description: 'Hardware procurement', issueType: 'Policy Violation', severity: 'medium', status: 'new' },
  { id: 'TXN-012', date: '2024-01-09', vendor: 'Elite Training Co.', amount: 9800.00, department: 'HR', description: 'Leadership training', issueType: null, severity: null, status: 'clean' },
  { id: 'TXN-013', date: '2024-01-08', vendor: 'Global Travel Inc.', amount: 12400.00, department: 'Sales', description: 'International conference', issueType: 'Pattern Alert', severity: 'medium', status: 'new' },
  { id: 'TXN-014', date: '2024-01-07', vendor: 'Print Solutions', amount: 3800.00, department: 'Marketing', description: 'Marketing materials', issueType: null, severity: null, status: 'clean' },
  { id: 'TXN-015', date: '2024-01-06', vendor: 'Unknown Vendor XYZ', amount: 55000.00, department: 'Executive', description: 'Consulting services', issueType: 'Semantic Anomaly', severity: 'high', status: 'new' },
  { id: 'TXN-016', date: '2024-01-05', vendor: 'Legal Associates', amount: 22000.00, department: 'Legal', description: 'Legal consultation', issueType: null, severity: null, status: 'clean' },
  { id: 'TXN-017', date: '2024-01-04', vendor: 'Tech Hardware Inc.', amount: 8900.00, department: 'IT', description: 'Server equipment', issueType: null, severity: null, status: 'clean' },
  { id: 'TXN-018', date: '2024-01-03', vendor: 'Luxury Hotels Group', amount: 6500.00, department: 'Sales', description: 'Client entertainment', issueType: 'Policy Violation', severity: 'medium', status: 'reviewed' },
  { id: 'TXN-019', date: '2024-01-02', vendor: 'Software Giants LLC', amount: 95000.00, department: 'IT', description: 'Enterprise software', issueType: 'Pattern Alert', severity: 'high', status: 'new' },
  { id: 'TXN-020', date: '2024-01-01', vendor: 'Cleaning Services Pro', amount: 2100.00, department: 'Operations', description: 'Facility cleaning', issueType: null, severity: null, status: 'clean' },
];

// Mock Audit Findings
export const mockFindings = [
  {
    id: 'FND-001',
    title: 'Unapproved Vendor Payment Exceeding Threshold',
    severity: 'high',
    status: 'draft',
    createdAt: '2024-01-20',
    condition: 'A payment of $75,000 was made to Strategic Consulting without proper procurement approval for amounts exceeding $50,000.',
    criteria: 'Per Procurement Guidelines Section 4.2, all vendor payments exceeding $50,000 require CFO approval and competitive bidding process.',
    cause: 'The requesting department bypassed the standard procurement process citing urgency. No competitive bids were obtained.',
    effect: 'Risk of overpayment and non-compliance with procurement policies. Potential financial loss estimated at $15,000-25,000.',
    relatedTransactions: ['TXN-007'],
    relatedPolicy: 'Procurement Guidelines',
  },
  {
    id: 'FND-002',
    title: 'Excessive Travel Expenses Without Pre-Approval',
    severity: 'medium',
    status: 'under-review',
    createdAt: '2024-01-19',
    condition: 'Multiple travel expenses totaling $21,300 were incurred without obtaining required pre-approval for international travel.',
    criteria: 'Travel & Expense Policy Section 2.1 requires pre-approval for all international travel and expenses exceeding $5,000.',
    cause: 'Sales team booked travel independently without using the corporate travel portal or obtaining management approval.',
    effect: 'Policy non-compliance and potential for unnecessary travel expenses. Identified savings opportunity of $4,000.',
    relatedTransactions: ['TXN-003', 'TXN-013'],
    relatedPolicy: 'Travel & Expense Policy',
  },
  {
    id: 'FND-003',
    title: 'Unknown Vendor Payment - Due Diligence Gap',
    severity: 'high',
    status: 'draft',
    createdAt: '2024-01-18',
    condition: 'A $55,000 payment was made to "Unknown Vendor XYZ" which is not registered in the approved vendor database.',
    criteria: 'Vendor Management Policy Section 3.1 requires all vendors to complete due diligence before any payments are processed.',
    cause: 'Vendor was added as an exception without completing the standard vendor onboarding process.',
    effect: 'Risk of fraud, money laundering, or payment to non-compliant vendors. Regulatory exposure.',
    relatedTransactions: ['TXN-015'],
    relatedPolicy: 'Vendor Management Policy',
  },
  {
    id: 'FND-004',
    title: 'Software License Overspend',
    severity: 'medium',
    status: 'approved',
    createdAt: '2024-01-17',
    condition: 'IT department purchased $15,750 in software licenses without checking existing license inventory.',
    criteria: 'IT Security Policy Section 5.3 requires license inventory review before new software purchases.',
    cause: 'Lack of centralized license management system and communication gap between IT teams.',
    effect: 'Duplicate license costs estimated at $8,000. Opportunity for license consolidation.',
    relatedTransactions: ['TXN-002'],
    relatedPolicy: 'IT Security Policy',
  },
  {
    id: 'FND-005',
    title: 'Unusual Payment Pattern - Consulting Services',
    severity: 'low',
    status: 'under-review',
    createdAt: '2024-01-16',
    condition: 'Marketing department shows 45% increase in consulting payments compared to prior quarter.',
    criteria: 'Internal benchmarking indicates significant deviation from historical spending patterns.',
    cause: 'Q1 campaign launch required additional external support. Budget was pre-approved but execution timing was concentrated.',
    effect: 'No immediate compliance concern, but recommend spreading payments across quarters for better cash flow management.',
    relatedTransactions: ['TXN-004'],
    relatedPolicy: 'Procurement Guidelines',
  },
  {
    id: 'FND-006',
    title: 'Enterprise Software Purchase - Competitive Bid Bypass',
    severity: 'high',
    status: 'draft',
    createdAt: '2024-01-15',
    condition: 'A $95,000 enterprise software purchase was made without competitive bidding as required for purchases over $25,000.',
    criteria: 'Procurement Guidelines Section 4.1 mandates competitive bidding for all purchases exceeding $25,000.',
    cause: 'Vendor claimed sole-source status, but no formal sole-source justification was documented.',
    effect: 'Potential overpayment risk. Industry benchmarking suggests 15-20% savings achievable through competitive process.',
    relatedTransactions: ['TXN-019'],
    relatedPolicy: 'Procurement Guidelines',
  },
  {
    id: 'FND-007',
    title: 'Client Entertainment Limit Exceeded',
    severity: 'low',
    status: 'resolved',
    createdAt: '2024-01-14',
    condition: 'Client entertainment expense of $6,500 exceeded the $5,000 per-event limit.',
    criteria: 'Travel & Expense Policy Section 3.4 limits client entertainment to $5,000 per event without VP approval.',
    cause: 'Sales representative was unaware of the updated policy limit effective January 2024.',
    effect: 'Minor policy violation. Training recommendation issued. No financial impact.',
    relatedTransactions: ['TXN-018'],
    relatedPolicy: 'Travel & Expense Policy',
  },
  {
    id: 'FND-008',
    title: 'Security Audit Vendor - Contract Review Required',
    severity: 'medium',
    status: 'draft',
    createdAt: '2024-01-13',
    condition: 'Security audit services of $28,000 were procured from a vendor with an expired master service agreement.',
    criteria: 'Vendor Management Policy Section 2.2 requires valid contracts before service delivery.',
    cause: 'Contract renewal was pending legal review when services were urgently needed.',
    effect: 'Limited recourse in case of service disputes. Recommend expedited contract renewal.',
    relatedTransactions: ['TXN-009'],
    relatedPolicy: 'Vendor Management Policy',
  },
];

// Mock Q&A History
export const mockQAHistory = [
  {
    id: 'qa-1',
    question: 'What is the approval threshold for travel expenses?',
    answer: 'According to the Travel & Expense Policy (Section 2.1), travel expenses exceeding $5,000 require pre-approval from the department manager. International travel requires additional approval from the VP level regardless of amount.',
    source: 'Travel & Expense Policy',
    page: 12,
    confidence: 0.95,
    timestamp: '2024-01-20T10:30:00Z',
  },
  {
    id: 'qa-2',
    question: 'How long should we retain financial records?',
    answer: 'The Data Retention Guidelines (Section 3.2) specify that financial records must be retained for a minimum of 7 years from the date of creation. Tax-related documents should be retained for 10 years.',
    source: 'Data Retention Guidelines',
    page: 8,
    confidence: 0.92,
    timestamp: '2024-01-20T09:15:00Z',
  },
  {
    id: 'qa-3',
    question: 'What is the competitive bidding threshold for procurement?',
    answer: 'Per Procurement Guidelines (Section 4.1), competitive bidding is required for all purchases exceeding $25,000. At least three qualified vendors must be invited to bid. Sole-source exceptions require documented justification and CFO approval.',
    source: 'Procurement Guidelines',
    page: 15,
    confidence: 0.98,
    timestamp: '2024-01-19T14:45:00Z',
  },
];

// Mock Recent Activity with proper typing
export type ActivityType = 'upload' | 'finding' | 'analysis' | 'question';

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
  user: string;
}

export const mockRecentActivity: Activity[] = [
  { id: 'act-1', type: 'upload', description: 'Travel & Expense Policy uploaded', timestamp: '2024-01-20T11:30:00Z', user: 'John Smith' },
  { id: 'act-2', type: 'finding', description: 'New finding: Unapproved Vendor Payment', timestamp: '2024-01-20T10:45:00Z', user: 'Sarah Johnson' },
  { id: 'act-3', type: 'analysis', description: 'Transaction analysis completed - 8 anomalies detected', timestamp: '2024-01-20T09:30:00Z', user: 'System' },
  { id: 'act-4', type: 'question', description: 'Policy question answered: Travel approval threshold', timestamp: '2024-01-20T09:15:00Z', user: 'Mike Chen' },
  { id: 'act-5', type: 'finding', description: 'Finding approved: Software License Overspend', timestamp: '2024-01-19T16:00:00Z', user: 'Lisa Wang' },
  { id: 'act-6', type: 'upload', description: 'Q1 Transactions imported (250 records)', timestamp: '2024-01-19T14:30:00Z', user: 'John Smith' },
];

// Dashboard Stats
export const mockDashboardStats = {
  totalPolicies: 6,
  activeTransactions: 250,
  findingsGenerated: 8,
  findingsBySeverity: {
    high: 4,
    medium: 3,
    low: 1,
  },
};