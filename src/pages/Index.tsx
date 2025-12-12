import { motion } from 'framer-motion';
import { Users, MessageSquare, Megaphone, Send, TrendingUp, TrendingDown } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { MessageChart } from '@/components/dashboard/MessageChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { mockDashboardStats } from '@/lib/mockData';

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, John! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your WhatsApp Business account today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Contacts"
            value={mockDashboardStats.totalContacts}
            change="+12.5%"
            changeType="positive"
            icon={Users}
            iconColor="text-primary"
            delay={0}
          />
          <StatsCard
            title="Active Chats"
            value={mockDashboardStats.activeChats}
            change="+8.2%"
            changeType="positive"
            icon={MessageSquare}
            iconColor="text-accent"
            delay={0.05}
          />
          <StatsCard
            title="Campaigns"
            value={mockDashboardStats.totalCampaigns}
            change="+3"
            changeType="neutral"
            icon={Megaphone}
            iconColor="text-blue-500"
            delay={0.1}
          />
          <StatsCard
            title="Messages Sent"
            value={mockDashboardStats.messagesSent}
            change="+24.8%"
            changeType="positive"
            icon={Send}
            iconColor="text-orange-500"
            delay={0.15}
          />
        </div>

        {/* Delivery Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 text-primary-foreground"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm mb-1">Delivery Rate</p>
                <p className="text-4xl font-bold">{mockDashboardStats.deliveryRate}%</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-7 h-7" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-primary-foreground/80">+2.4% from last week</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="bg-gradient-to-br from-accent to-accent/80 rounded-xl p-6 text-accent-foreground"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-accent-foreground/80 text-sm mb-1">Read Rate</p>
                <p className="text-4xl font-bold">{mockDashboardStats.readRate}%</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-7 h-7" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-accent-foreground/80">+5.1% from last week</span>
            </div>
          </motion.div>
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MessageChart />
          </div>
          <div className="space-y-6">
            <QuickActions />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="mt-6">
          <ActivityFeed />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
