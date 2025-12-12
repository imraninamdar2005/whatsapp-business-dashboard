import { motion } from 'framer-motion';
import { MessageSquare, Megaphone, Users, FileText } from 'lucide-react';
import { mockActivities } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const iconMap = {
  message: MessageSquare,
  campaign: Megaphone,
  contact: Users,
  template: FileText,
};

const colorMap = {
  message: 'bg-primary/10 text-primary',
  campaign: 'bg-accent/10 text-accent',
  contact: 'bg-blue-500/10 text-blue-500',
  template: 'bg-orange-500/10 text-orange-500',
};

export function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-card rounded-xl p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest updates from your account</p>
        </div>
        <button className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
          View all
        </button>
      </div>
      
      <div className="space-y-4">
        {mockActivities.map((activity, index) => {
          const Icon = iconMap[activity.type];
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
                colorMap[activity.type]
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
