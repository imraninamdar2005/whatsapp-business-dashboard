import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Plus, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  BarChart3,
  Calendar,
  Users,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Eye,
  Loader2,
  X,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/stores/appStore';
import { campaignSchema, CampaignInput } from '@/lib/validations';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300', icon: AlertCircle },
  scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Clock },
  running: { label: 'Running', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Play },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle2 },
  paused: { label: 'Paused', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: Pause },
};

// Campaign Creation Modal Component
function CreateCampaignModal({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState(1);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { templates, contacts } = useAppStore();

  const form = useForm<CampaignInput>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      templateId: '',
      sheetName: '',
      contactIds: [],
      scheduledAt: '',
    },
  });

  const approvedTemplates = templates.filter(t => t.status === 'approved');

  const onSubmit = async (data: CampaignInput) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add to store (in production, use API)
      useAppStore.setState(state => ({
        campaigns: [...state.campaigns, {
          id: Date.now().toString(),
          name: data.name,
          status: data.scheduledAt ? 'scheduled' : 'draft',
          templateId: data.templateId,
          templateName: templates.find(t => t.id === data.templateId)?.name || '',
          totalContacts: selectedContacts.length,
          sent: 0,
          delivered: 0,
          read: 0,
          failed: 0,
          createdAt: new Date(),
          scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
        }],
      }));

      toast.success('Campaign created successfully!');
      onOpenChange(false);
      form.reset();
      setStep(1);
      setSelectedContacts([]);
    } catch (error) {
      toast.error('Failed to create campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleContact = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const nextStep = () => {
    if (step === 1 && !form.getValues('name')) {
      form.setError('name', { message: 'Campaign name is required' });
      return;
    }
    if (step === 2 && !form.getValues('templateId')) {
      form.setError('templateId', { message: 'Please select a template' });
      return;
    }
    setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step >= s 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              )}>
                {s}
              </div>
              {s < 4 && (
                <div className={cn(
                  "w-16 h-1 mx-2 rounded",
                  step > s ? "bg-primary" : "bg-muted"
                )} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {/* Step 1: Campaign Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-medium text-foreground">Campaign Details</h3>
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name *</Label>
                  <Input
                    {...form.register('name')}
                    id="name"
                    placeholder="Holiday Sale 2024"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Schedule (Optional)</Label>
                  <Input
                    {...form.register('scheduledAt')}
                    id="scheduledAt"
                    type="datetime-local"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to save as draft
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Select Template */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-medium text-foreground">Select Template</h3>
                <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto custom-scrollbar">
                  {approvedTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => form.setValue('templateId', template.id)}
                      className={cn(
                        "p-4 rounded-lg border-2 cursor-pointer transition-all",
                        form.watch('templateId') === template.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <p className="font-medium text-foreground mb-1">{template.name}</p>
                      <Badge variant="secondary" className="text-xs mb-2">
                        {template.category}
                      </Badge>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {template.content}
                      </p>
                    </div>
                  ))}
                </div>
                {form.formState.errors.templateId && (
                  <p className="text-sm text-destructive">{form.formState.errors.templateId.message}</p>
                )}
              </motion.div>
            )}

            {/* Step 3: Select Contacts */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-foreground">Select Contacts</h3>
                  <Badge variant="secondary">
                    {selectedContacts.length} selected
                  </Badge>
                </div>
                <div className="flex gap-2 mb-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedContacts(contacts.map(c => c.id))}
                  >
                    Select All
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedContacts([])}
                  >
                    Clear All
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => toggleContact(contact.id)}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors",
                        selectedContacts.includes(contact.id)
                          ? "bg-primary/10 border border-primary/30"
                          : "bg-muted/50 hover:bg-muted"
                      )}
                    >
                      <Checkbox checked={selectedContacts.includes(contact.id)} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{contact.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{contact.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {selectedContacts.length === 0 && (
                  <p className="text-sm text-destructive">Please select at least one contact</p>
                )}
              </motion.div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="font-medium text-foreground">Review Campaign</h3>
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Campaign Name</span>
                    <span className="font-medium text-foreground">{form.watch('name')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Template</span>
                    <span className="font-medium text-foreground">
                      {templates.find(t => t.id === form.watch('templateId'))?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recipients</span>
                    <span className="font-medium text-foreground">{selectedContacts.length} contacts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Schedule</span>
                    <span className="font-medium text-foreground">
                      {form.watch('scheduledAt') 
                        ? format(new Date(form.watch('scheduledAt')!), 'MMM d, yyyy HH:mm')
                        : 'Save as draft'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            {step < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={step === 3 && selectedContacts.length === 0}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Campaign'
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const Campaigns = () => {
  const { campaigns } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getDeliveryRate = (campaign: typeof campaigns[0]) => {
    if (campaign.sent === 0) return 0;
    return Math.round((campaign.delivered / campaign.sent) * 100);
  };

  const getReadRate = (campaign: typeof campaigns[0]) => {
    if (campaign.delivered === 0) return 0;
    return Math.round((campaign.read / campaign.delivered) * 100);
  };

  return (
    <MainLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Campaigns</h1>
            <p className="text-muted-foreground">
              Create and manage your bulk messaging campaigns
            </p>
          </div>
          <Button 
            className="gap-2 bg-primary hover:bg-primary/90"
            onClick={() => setCreateModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{campaigns.length}</p>
                <p className="text-sm text-muted-foreground">Total Campaigns</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Play className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {campaigns.filter(c => c.status === 'running').length}
                </p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {campaigns.filter(c => c.status === 'scheduled').length}
                </p>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {campaigns.filter(c => c.status === 'completed').length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
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
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Campaign Cards */}
        <div className="grid gap-4">
          {filteredCampaigns.map((campaign, index) => {
            const StatusIcon = statusConfig[campaign.status].icon;
            const deliveryRate = getDeliveryRate(campaign);
            const readRate = getReadRate(campaign);

            return (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="bg-card rounded-xl p-6 shadow-card hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Campaign Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {campaign.name}
                      </h3>
                      <Badge className={cn("flex-shrink-0", statusConfig[campaign.status].color)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusConfig[campaign.status].label}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(campaign.createdAt, 'MMM d, yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {campaign.totalContacts.toLocaleString()} contacts
                      </span>
                      <span className="flex items-center gap-1">
                        <Send className="w-4 h-4" />
                        {campaign.templateName}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-6 lg:gap-8">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{campaign.sent.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Sent</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{deliveryRate}%</p>
                      <p className="text-xs text-muted-foreground">Delivered</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-accent">{readRate}%</p>
                      <p className="text-xs text-muted-foreground">Read</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {campaign.status === 'running' && (
                          <DropdownMenuItem>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause Campaign
                          </DropdownMenuItem>
                        )}
                        {campaign.status === 'paused' && (
                          <DropdownMenuItem>
                            <Play className="w-4 h-4 mr-2" />
                            Resume Campaign
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Analytics
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Progress Bar for Running Campaigns */}
                {campaign.status === 'running' && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium text-foreground">
                        {Math.round((campaign.sent / campaign.totalContacts) * 100)}%
                      </span>
                    </div>
                    <Progress value={(campaign.sent / campaign.totalContacts) * 100} className="h-2" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCampaigns.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-1">No campaigns found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or create a new campaign
            </p>
            <Button className="gap-2" onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4" />
              Create Campaign
            </Button>
          </motion.div>
        )}

        {/* Create Campaign Modal */}
        <CreateCampaignModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
      </div>
    </MainLayout>
  );
};

export default Campaigns;
