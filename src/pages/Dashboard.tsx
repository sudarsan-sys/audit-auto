import { Link } from 'react-router-dom';
import { FileText, AlertTriangle, ClipboardCheck, ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/dashboard/StatCard';
import { SeverityChart } from '@/components/dashboard/SeverityChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { mockDashboardStats, mockRecentActivity } from '@/data/mockData';

export default function Dashboard() {
  const currentTime = new Date();
  const greeting = currentTime.getHours() < 12 ? 'Good morning' : currentTime.getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            {greeting}, John
          </h1>
          <p className="text-muted-foreground mt-1">
            Last login: Today at 9:30 AM
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-success/10 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          All systems operational
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Policies"
          value={mockDashboardStats.totalPolicies}
          icon={FileText}
          variant="primary"
          description="Active documents"
        />
        <StatCard
          title="Transactions Analyzed"
          value={mockDashboardStats.activeTransactions}
          icon={TrendingUp}
          variant="accent"
          trend={{ value: 12, isPositive: true }}
          description="vs last month"
        />
        <StatCard
          title="Findings Generated"
          value={mockDashboardStats.findingsGenerated}
          icon={AlertTriangle}
          variant="default"
          description={`${mockDashboardStats.findingsBySeverity.high} high priority`}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 module-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/policies" className="group">
              <div className="p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-all hover:shadow-md">
                <FileText className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-medium text-foreground">Policy Navigator</h3>
                <p className="text-sm text-muted-foreground mt-1">Search and analyze policies</p>
                <div className="flex items-center gap-1 mt-3 text-sm text-accent font-medium">
                  Open <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
            <Link to="/transactions" className="group">
              <div className="p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-all hover:shadow-md">
                <AlertTriangle className="w-8 h-8 text-warning mb-3" />
                <h3 className="font-medium text-foreground">Transaction Sentinel</h3>
                <p className="text-sm text-muted-foreground mt-1">Detect anomalies in data</p>
                <div className="flex items-center gap-1 mt-3 text-sm text-accent font-medium">
                  Open <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
            <Link to="/findings" className="group">
              <div className="p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/50 transition-all hover:shadow-md">
                <ClipboardCheck className="w-8 h-8 text-success mb-3" />
                <h3 className="font-medium text-foreground">Auto-Reporter</h3>
                <p className="text-sm text-muted-foreground mt-1">Generate audit findings</p>
                <div className="flex items-center gap-1 mt-3 text-sm text-accent font-medium">
                  Open <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="module-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Findings by Severity</h2>
          <SeverityChart data={mockDashboardStats.findingsBySeverity} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="module-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          <Button variant="ghost" size="sm" className="text-accent">
            View all
          </Button>
        </div>
        <ActivityFeed activities={mockRecentActivity} />
      </div>
    </div>
  );
}
