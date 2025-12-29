import { FileUp, AlertCircle, Search, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Activity } from '@/data/mockData';

interface ActivityFeedProps {
  activities: Activity[];
}

const activityIcons = {
  upload: FileUp,
  finding: AlertCircle,
  analysis: CheckCircle,
  question: Search,
};

const activityColors = {
  upload: 'bg-info/10 text-info',
  finding: 'bg-warning/10 text-warning',
  analysis: 'bg-success/10 text-success',
  question: 'bg-accent/10 text-accent',
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = activityIcons[activity.type];
        return (
          <div
            key={activity.id}
            className="flex items-start gap-3 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={cn('p-2 rounded-lg', activityColors[activity.type])}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">{activity.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{activity.user}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(activity.timestamp)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
