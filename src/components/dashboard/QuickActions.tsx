import { motion } from 'framer-motion';
import { Plus, Send, Upload, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const actions = [
  { 
    title: 'New Campaign', 
    description: 'Create a bulk messaging campaign',
    icon: Megaphone,
    color: 'from-primary to-primary/80',
    href: '/campaigns'
  },
  { 
    title: 'Send Message', 
    description: 'Send a quick message to a contact',
    icon: Send,
    color: 'from-accent to-accent/80',
    href: '/chats'
  },
  { 
    title: 'Import Contacts', 
    description: 'Upload contacts from CSV or Excel',
    icon: Upload,
    color: 'from-blue-500 to-blue-600',
    href: '/contacts'
  },
  { 
    title: 'Quick Template', 
    description: 'Use a pre-approved template',
    icon: Zap,
    color: 'from-orange-500 to-orange-600',
    href: '/templates'
  },
];

import { Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-card rounded-xl p-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
          <p className="text-sm text-muted-foreground">Common tasks at your fingertips</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Link
            key={action.title}
            to={action.href}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br",
                action.color
              )}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-medium text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                {action.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {action.description}
              </p>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
