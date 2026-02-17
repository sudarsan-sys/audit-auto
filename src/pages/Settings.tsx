import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Key, 
  Users, 
  Bell, 
  Database, 
  FileText,
  Shield,
  ChevronRight,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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

const settingsSections = [
  { id: 'api', name: 'API Configuration', icon: Key },
  { id: 'users', name: 'User Management', icon: Users },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'data', name: 'Data Retention', icon: Database },
  { id: 'audit', name: 'Audit Log', icon: FileText },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState('api');
  const [showApiKey, setShowApiKey] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case 'api':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">API Configuration</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Configure your AI service connections for policy analysis and anomaly detection.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">OpenAI API</p>
                      <p className="text-sm text-muted-foreground">GPT-4 for policy analysis</p>
                    </div>
                  </div>
                  <Badge variant="success">Connected</Badge>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input 
                      type={showApiKey ? 'text' : 'password'} 
                      value="sk-proj-xxxxxxxxxxxxxxxxxxxx" 
                      readOnly 
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <Button variant="outline">Update</Button>
                </div>
              </div>

              <div className="p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-accent" />
                    <div>
                      <p className="font-medium text-foreground">Vector Database</p>
                      <p className="text-sm text-muted-foreground">Pinecone for document embeddings</p>
                    </div>
                  </div>
                  <Badge variant="success">Connected</Badge>
                </div>
                <div className="flex gap-2">
                  <Input type="password" value="xxxxxxxx-xxxx-xxxx" readOnly className="flex-1" />
                  <Button variant="outline">Update</Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">User Management</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Manage team members and their access permissions.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { name: 'John Smith', email: 'john.smith@company.com', role: 'Admin', active: true },
                { name: 'Sarah Johnson', email: 'sarah.j@company.com', role: 'Auditor', active: true },
                { name: 'Mike Chen', email: 'mike.chen@company.com', role: 'Viewer', active: true },
                { name: 'Lisa Wang', email: 'lisa.wang@company.com', role: 'Auditor', active: false },
              ].map((user) => (
                <div key={user.email} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">{user.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                    <Switch checked={user.active} />
                  </div>
                </div>
              ))}
            </div>

            <Button>
              <Users className="w-4 h-4 mr-2" />
              Invite User
            </Button>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Configure how and when you receive alerts.
              </p>
            </div>

            <div className="space-y-4">
              {[
                { title: 'High Severity Findings', description: 'Get notified immediately for high-priority issues', enabled: true },
                { title: 'New Anomaly Detection', description: 'Alert when new transaction anomalies are found', enabled: true },
                { title: 'Finding Status Updates', description: 'Notifications when findings are reviewed or approved', enabled: false },
                { title: 'Weekly Summary Report', description: 'Receive a weekly digest of audit activities', enabled: true },
                { title: 'Policy Document Updates', description: 'Alert when new policies are uploaded', enabled: false },
              ].map((notification) => (
                <div key={notification.title} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                  <Switch checked={notification.enabled} />
                </div>
              ))}
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Data Retention Policies</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Configure how long data is retained in the system.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-secondary/30 rounded-lg">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Transaction Data Retention
                </label>
                <Select defaultValue="7">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Year</SelectItem>
                    <SelectItem value="3">3 Years</SelectItem>
                    <SelectItem value="5">5 Years</SelectItem>
                    <SelectItem value="7">7 Years (Recommended)</SelectItem>
                    <SelectItem value="10">10 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-secondary/30 rounded-lg">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Audit Findings Retention
                </label>
                <Select defaultValue="10">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Years</SelectItem>
                    <SelectItem value="7">7 Years</SelectItem>
                    <SelectItem value="10">10 Years (Recommended)</SelectItem>
                    <SelectItem value="forever">Indefinitely</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-secondary/30 rounded-lg">
                <label className="block text-sm font-medium text-foreground mb-2">
                  System Logs Retention
                </label>
                <Select defaultValue="1">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">6 Months</SelectItem>
                    <SelectItem value="1">1 Year (Recommended)</SelectItem>
                    <SelectItem value="2">2 Years</SelectItem>
                    <SelectItem value="3">3 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        );

      case 'audit':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Audit Log</h3>
              <p className="text-sm text-muted-foreground mb-6">
                View system activity and user actions.
              </p>
            </div>

            <div className="space-y-2">
              {[
                { action: 'Finding approved', user: 'Lisa Wang', timestamp: '2024-01-20 16:00' },
                { action: 'Transaction analysis completed', user: 'System', timestamp: '2024-01-20 09:30' },
                { action: 'Policy document uploaded', user: 'John Smith', timestamp: '2024-01-20 09:15' },
                { action: 'User login', user: 'Sarah Johnson', timestamp: '2024-01-19 08:45' },
                { action: 'Finding submitted for review', user: 'Mike Chen', timestamp: '2024-01-19 14:30' },
                { action: 'API key updated', user: 'John Smith', timestamp: '2024-01-18 11:00' },
                { action: 'New user invited', user: 'John Smith', timestamp: '2024-01-18 10:30' },
              ].map((log, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{log.action}</p>
                      <p className="text-xs text-muted-foreground">by {log.user}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                </div>
              ))}
            </div>

            <Button variant="outline">
              Load More
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Settings Sidebar */}
      <div className="w-64 border-r border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-6">
          <SettingsIcon className="w-5 h-5 text-muted-foreground" />
          <h2 className="font-semibold text-foreground">Settings</h2>
        </div>
        <nav className="space-y-1">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {section.name}
                </div>
                <ChevronRight className={cn('w-4 h-4', isActive && 'text-primary-foreground')} />
              </button>
            );
          })}
        </nav>
      </div>

      {/* Settings Content */}
      <ScrollArea className="flex-1 p-8">
        <div className="max-w-2xl">
          {renderContent()}
        </div>
      </ScrollArea>
    </div>
  );
}
