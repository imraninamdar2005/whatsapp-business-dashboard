import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Plus, 
  Upload, 
  Download, 
  MoreVertical,
  Tag,
  Trash2,
  Mail,
  Phone,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
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
import { useContacts, useBulkDeleteContacts } from '@/hooks/useApi';
import { AddContactModal } from '@/components/contacts/AddContactModal';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const tagColors: Record<string, string> = {
  VIP: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Customer: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Lead: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Prospect: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Newsletter: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
};

const Contacts = () => {
  const { setSelectedContact } = useAppStore();
  const { data: contacts = [], isLoading, refetch } = useContacts();
  const bulkDelete = useBulkDeleteContacts();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    contacts.forEach(contact => contact.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => contact.tags.includes(tag));
      
      const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
      
      return matchesSearch && matchesTags && matchesStatus;
    });
  }, [contacts, searchQuery, selectedTags, statusFilter]);

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const toggleAllContacts = () => {
    if (selectedContacts.length === filteredContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(filteredContacts.map(c => c.id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) return;
    
    try {
      await bulkDelete.mutateAsync(selectedContacts);
      setSelectedContacts([]);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleExport = () => {
    // In production, use api.contacts.exportToCSV()
    const csvContent = [
      ['Name', 'Phone', 'Email', 'Tags', 'Status'].join(','),
      ...filteredContacts.map(c => 
        [c.name, c.phone, c.email || '', c.tags.join(';'), c.status].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.csv';
    a.click();
    
    toast.success('Contacts exported successfully');
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
            <h1 className="text-3xl font-bold text-foreground mb-1">Contacts</h1>
            <p className="text-muted-foreground">
              Manage your {contacts.length.toLocaleString()} WhatsApp contacts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={() => refetch()}
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2"
              onClick={handleExport}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button 
              size="sm" 
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={() => setAddModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add Contact
            </Button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-4 shadow-card mb-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            {/* Tags Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                  {selectedTags.length > 0 && (
                    <Badge variant="secondary" className="ml-1 px-1.5">
                      {selectedTags.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {allTags.map(tag => (
                  <DropdownMenuItem
                    key={tag}
                    onClick={() => {
                      setSelectedTags(prev =>
                        prev.includes(tag)
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                    className="gap-2"
                  >
                    <Checkbox checked={selectedTags.includes(tag)} />
                    <span>{tag}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedTags.map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1 cursor-pointer"
                  onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                >
                  {tag}
                  <span className="ml-1">×</span>
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTags([])}
                className="h-6 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </motion.div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedContacts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-4 flex items-center justify-between"
            >
              <span className="text-sm font-medium text-foreground">
                {selectedContacts.length} contact{selectedContacts.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Tag className="w-4 h-4" />
                  Add Tag
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Send Message
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 text-destructive hover:text-destructive"
                  onClick={handleBulkDelete}
                  disabled={bulkDelete.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contacts List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl shadow-card overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-3 bg-muted/50 border-b border-border text-sm font-medium text-muted-foreground">
            <div className="flex items-center">
              <Checkbox 
                checked={selectedContacts.length === filteredContacts.length && filteredContacts.length > 0}
                onCheckedChange={toggleAllContacts}
              />
            </div>
            <div>Contact</div>
            <div className="hidden md:block">Tags</div>
            <div className="hidden lg:block">Last Message</div>
            <div className="w-10"></div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="divide-y divide-border">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-3 items-center">
                  <Skeleton className="w-4 h-4" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="w-32 h-4" />
                      <Skeleton className="w-24 h-3" />
                    </div>
                  </div>
                  <div className="hidden md:flex gap-1">
                    <Skeleton className="w-16 h-5" />
                    <Skeleton className="w-16 h-5" />
                  </div>
                  <Skeleton className="hidden lg:block w-40 h-4" />
                  <Skeleton className="w-8 h-8" />
                </div>
              ))}
            </div>
          )}

          {/* Contact Rows */}
          {!isLoading && (
            <div className="divide-y divide-border">
              {filteredContacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * index }}
                  className={cn(
                    "grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-4 py-3 items-center hover:bg-muted/30 transition-colors",
                    selectedContacts.includes(contact.id) && "bg-primary/5"
                  )}
                >
                  <div className="flex items-center">
                    <Checkbox 
                      checked={selectedContacts.includes(contact.id)}
                      onCheckedChange={() => toggleContactSelection(contact.id)}
                    />
                  </div>

                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {contact.status === 'active' && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent rounded-full border-2 border-card" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{contact.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{contact.phone}</p>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center gap-1.5">
                    {contact.tags.slice(0, 2).map(tag => (
                      <Badge 
                        key={tag} 
                        variant="secondary"
                        className={cn("text-xs", tagColors[tag])}
                      >
                        {tag}
                      </Badge>
                    ))}
                    {contact.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{contact.tags.length - 2}
                      </Badge>
                    )}
                  </div>

                  <div className="hidden lg:block min-w-0">
                    {contact.lastMessage && (
                      <div className="text-sm">
                        <p className="text-foreground truncate max-w-[200px]">{contact.lastMessage}</p>
                        <p className="text-xs text-muted-foreground">
                          {contact.lastMessageTime && formatDistanceToNow(contact.lastMessageTime, { addSuffix: true })}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {contact.unreadCount && contact.unreadCount > 0 && (
                      <Badge className="bg-accent text-accent-foreground h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {contact.unreadCount}
                      </Badge>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to="/chats" onClick={() => setSelectedContact(contact)}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Message
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Phone className="w-4 h-4 mr-2" />
                          Call
                        </DropdownMenuItem>
                        {contact.email && (
                          <DropdownMenuItem>
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredContacts.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No contacts found</h3>
              <p className="text-muted-foreground mb-4">
                {contacts.length === 0 
                  ? "Add your first contact to get started"
                  : "Try adjusting your search or filter criteria"
                }
              </p>
              {contacts.length === 0 ? (
                <Button onClick={() => setAddModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Contact
                </Button>
              ) : (
                <Button onClick={() => { setSearchQuery(''); setSelectedTags([]); setStatusFilter('all'); }}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </motion.div>

        {/* Pagination Info */}
        {!isLoading && filteredContacts.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Showing {filteredContacts.length} of {contacts.length} contacts
          </div>
        )}

        {/* Add Contact Modal */}
        <AddContactModal open={addModalOpen} onOpenChange={setAddModalOpen} />
      </div>
    </MainLayout>
  );
};

export default Contacts;
