export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  tags: string[];
  status: 'active' | 'inactive';
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  customFields?: Record<string, string>;
}

export interface Message {
  id: string;
  contactId: string;
  content: string;
  type: 'text' | 'image' | 'document' | 'template';
  direction: 'in' | 'out';
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
  templateId?: string;
  mediaUrl?: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
  templateId: string;
  templateName: string;
  totalContacts: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
  createdAt: Date;
  scheduledAt?: Date;
  completedAt?: Date;
}

export interface Template {
  id: string;
  name: string;
  category: 'marketing' | 'utility' | 'authentication';
  language: string;
  status: 'approved' | 'pending' | 'rejected';
  content: string;
  parameters: string[];
  headerType?: 'text' | 'image' | 'video' | 'document';
  headerContent?: string;
  footerText?: string;
  buttons?: TemplateButton[];
}

export interface TemplateButton {
  type: 'quick_reply' | 'url' | 'phone';
  text: string;
  url?: string;
  phone?: string;
}

export interface DashboardStats {
  totalContacts: number;
  activeChats: number;
  totalCampaigns: number;
  messagesSent: number;
  deliveryRate: number;
  readRate: number;
}

export interface ChartData {
  name: string;
  sent: number;
  delivered: number;
  read: number;
}

export interface Activity {
  id: string;
  type: 'message' | 'campaign' | 'contact' | 'template';
  title: string;
  description: string;
  timestamp: Date;
  icon?: string;
}

export type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
};
