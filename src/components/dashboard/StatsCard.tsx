import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  delay?: number;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-primary',
  delay = 0 
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="stats-card group"
    >
      <div className="stats-card-gradient" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
            "bg-gradient-to-br from-primary/10 to-accent/10"
          )}>
            <Icon className={cn("w-6 h-6", iconColor)} />
          </div>
          {change && (
            <span className={cn(
              "text-sm font-medium px-2 py-1 rounded-full",
              changeType === 'positive' && "text-accent bg-accent/10",
              changeType === 'negative' && "text-destructive bg-destructive/10",
              changeType === 'neutral' && "text-muted-foreground bg-muted"
            )}>
              {change}
            </span>
          )}
        </div>
        <h3 className="text-3xl font-bold text-foreground mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </motion.div>
  );
}
