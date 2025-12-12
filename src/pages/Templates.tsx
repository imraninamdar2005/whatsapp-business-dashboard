import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Eye, 
  Copy, 
  Send,
  CheckCircle2,
  Clock,
  XCircle,
  Image,
  FileText,
  Video,
  ExternalLink
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';
import { Template } from '@/types';

const statusConfig = {
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle2 },
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: XCircle },
};

const categoryConfig = {
  marketing: { label: 'Marketing', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  utility: { label: 'Utility', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  authentication: { label: 'Authentication', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
};

const headerIcons = {
  image: Image,
  video: Video,
  document: FileText,
  text: FileText,
};

const TemplatePreview = ({ template }: { template: Template }) => {
  const HeaderIcon = template.headerType ? headerIcons[template.headerType] : null;

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-whatsapp-chat-bg rounded-lg p-4">
        <div className="bg-whatsapp-message-in rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          {template.headerType && template.headerContent && (
            <div className="relative">
              {template.headerType === 'image' && (
                <img 
                  src={template.headerContent} 
                  alt="Template header" 
                  className="w-full h-40 object-cover"
                />
              )}
              {(template.headerType === 'video' || template.headerType === 'document') && (
                <div className="h-40 bg-muted flex items-center justify-center">
                  {HeaderIcon && <HeaderIcon className="w-12 h-12 text-muted-foreground" />}
                </div>
              )}
            </div>
          )}
          
          {/* Body */}
          <div className="p-3">
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {template.content.replace(/\{\{(\d+)\}\}/g, (_, num) => {
                const paramIndex = parseInt(num) - 1;
                return `[${template.parameters[paramIndex] || 'param'}]`;
              })}
            </p>
          </div>

          {/* Footer */}
          {template.footerText && (
            <div className="px-3 pb-2">
              <p className="text-xs text-muted-foreground">{template.footerText}</p>
            </div>
          )}

          {/* Buttons */}
          {template.buttons && template.buttons.length > 0 && (
            <div className="border-t border-border">
              {template.buttons.map((button, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center gap-2 py-3 text-primary text-sm font-medium border-b border-border last:border-b-0 hover:bg-muted/50 cursor-pointer"
                >
                  {button.type === 'url' && <ExternalLink className="w-4 h-4" />}
                  {button.text}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Templates = () => {
  const { templates } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || template.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <MainLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-foreground mb-1">Templates</h1>
          <p className="text-muted-foreground">
            Browse and use your approved WhatsApp message templates
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-card rounded-xl p-4 shadow-card">
            <p className="text-2xl font-bold text-foreground">{templates.length}</p>
            <p className="text-sm text-muted-foreground">Total Templates</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-card">
            <p className="text-2xl font-bold text-green-600">{templates.filter(t => t.status === 'approved').length}</p>
            <p className="text-sm text-muted-foreground">Approved</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-card">
            <p className="text-2xl font-bold text-amber-600">{templates.filter(t => t.status === 'pending').length}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-card">
            <p className="text-2xl font-bold text-purple-600">{templates.filter(t => t.category === 'marketing').length}</p>
            <p className="text-sm text-muted-foreground">Marketing</p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="utility">Utility</SelectItem>
              <SelectItem value="authentication">Authentication</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template, index) => {
            const StatusIcon = statusConfig[template.status].icon;

            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="bg-card rounded-xl p-5 shadow-card hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate mb-1">
                      {template.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-xs", statusConfig[template.status].color)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[template.status].label}
                      </Badge>
                      <Badge className={cn("text-xs", categoryConfig[template.category].color)}>
                        {categoryConfig[template.category].label}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Template Preview */}
                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {template.content.replace(/\{\{(\d+)\}\}/g, (_, num) => {
                      const paramIndex = parseInt(num) - 1;
                      return `[${template.parameters[paramIndex] || 'param'}]`;
                    })}
                  </p>
                </div>

                {/* Parameters */}
                {template.parameters.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Parameters:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.parameters.map((param, i) => (
                        <span key={i} className="text-xs bg-secondary px-2 py-1 rounded-md text-secondary-foreground">
                          {`{{${i + 1}}} ${param}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-2"
                        onClick={() => setSelectedTemplate(template)}
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Template Preview</DialogTitle>
                      </DialogHeader>
                      {selectedTemplate && <TemplatePreview template={selectedTemplate} />}
                    </DialogContent>
                  </Dialog>
                  <Button 
                    size="sm" 
                    className="flex-1 gap-2 bg-primary hover:bg-primary/90"
                    disabled={template.status !== 'approved'}
                  >
                    <Send className="w-4 h-4" />
                    Use
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No templates found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default Templates;
