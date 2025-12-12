import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ContactCreateInput } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Contact } from '@/types';
import { toast } from 'sonner';
import { useAppStore } from '@/stores/appStore';

// Query keys
export const queryKeys = {
  contacts: ['contacts'] as const,
  contact: (id: string) => ['contact', id] as const,
  tags: ['tags'] as const,
  chats: (phone: string) => ['chats', phone] as const,
  campaigns: ['campaigns'] as const,
  campaign: (id: string) => ['campaign', id] as const,
  templates: ['templates'] as const,
  sheets: ['sheets'] as const,
};

// Contacts hooks
export function useContacts() {
  const { user } = useAuth();
  const { contacts } = useAppStore();
  
  return useQuery({
    queryKey: queryKeys.contacts,
    queryFn: async () => {
      // For demo, use store data
      // In production: const { data } = await api.contacts.getAll(user!.id);
      return contacts;
    },
    enabled: !!user,
    staleTime: 30000,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  const { contacts } = useAppStore();
  
  return useMutation({
    mutationFn: async (data: ContactCreateInput) => {
      // For demo, create locally
      // In production: const { data: contact } = await api.contacts.create(data);
      const newContact: Contact = {
        id: Date.now().toString(),
        name: data.name,
        phone: data.phone,
        email: data.email,
        tags: data.tags || [],
        status: 'active',
        customFields: data.customFields,
      };
      return newContact;
    },
    onSuccess: (newContact) => {
      // Update local store
      useAppStore.setState(state => ({
        contacts: [...state.contacts, newContact],
      }));
      
      // Invalidate query to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts });
      
      toast.success('Contact created', {
        description: `${newContact.name} has been added to your contacts.`,
      });
    },
    onError: (error) => {
      toast.error('Failed to create contact', {
        description: error instanceof Error ? error.message : 'Please try again.',
      });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContactCreateInput> }) => {
      // For demo, update locally
      // In production: const { data: contact } = await api.contacts.update(id, data);
      return { id, ...data };
    },
    onSuccess: (updatedData) => {
      useAppStore.setState(state => ({
        contacts: state.contacts.map(c => 
          c.id === updatedData.id ? { ...c, ...updatedData } : c
        ),
      }));
      
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts });
      toast.success('Contact updated');
    },
    onError: (error) => {
      toast.error('Failed to update contact');
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // For demo, delete locally
      // In production: await api.contacts.delete(id);
      return id;
    },
    onSuccess: (deletedId) => {
      useAppStore.setState(state => ({
        contacts: state.contacts.filter(c => c.id !== deletedId),
      }));
      
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts });
      toast.success('Contact deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete contact');
    },
  });
}

export function useBulkDeleteContacts() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ids: string[]) => {
      // For demo, delete locally
      // In production: await api.contacts.bulkDelete(ids);
      return ids;
    },
    onSuccess: (deletedIds) => {
      useAppStore.setState(state => ({
        contacts: state.contacts.filter(c => !deletedIds.includes(c.id)),
      }));
      
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts });
      toast.success(`${deletedIds.length} contacts deleted`);
    },
    onError: (error) => {
      toast.error('Failed to delete contacts');
    },
  });
}

// Tags hooks
export function useTags() {
  const { contacts } = useAppStore();
  
  return useQuery({
    queryKey: queryKeys.tags,
    queryFn: async () => {
      // For demo, extract from contacts
      // In production: const { data } = await api.tags.getAll();
      const tags = new Set<string>();
      contacts.forEach(c => c.tags.forEach(t => tags.add(t)));
      return Array.from(tags);
    },
    staleTime: 60000,
  });
}

// Campaigns hooks
export function useCampaigns() {
  const { campaigns } = useAppStore();
  
  return useQuery({
    queryKey: queryKeys.campaigns,
    queryFn: async () => {
      // For demo, use store data
      // In production: const { data } = await api.campaigns.getAll();
      return campaigns;
    },
    staleTime: 30000,
  });
}

// Templates hooks
export function useTemplates() {
  const { templates } = useAppStore();
  
  return useQuery({
    queryKey: queryKeys.templates,
    queryFn: async () => {
      // For demo, use store data
      // In production: const { data } = await api.templates.getAll();
      return templates;
    },
    staleTime: 60000,
  });
}

// Chat hooks
export function useChatHistory(phoneNumber: string | null) {
  const { messages } = useAppStore();
  const { selectedContact } = useAppStore();
  
  return useQuery({
    queryKey: queryKeys.chats(phoneNumber || ''),
    queryFn: async () => {
      // For demo, filter messages from store
      // In production: const { data } = await api.chats.getHistory(phoneNumber!);
      return messages.filter(m => m.contactId === selectedContact?.id);
    },
    enabled: !!phoneNumber,
    staleTime: 10000,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { addMessage, selectedContact } = useAppStore();
  
  return useMutation({
    mutationFn: async (data: { phone: string; message: string }) => {
      // For demo, add to store
      // In production: const { data: response } = await api.chats.sendMessage(data);
      const newMessage = {
        id: `m${Date.now()}`,
        contactId: selectedContact?.id || '',
        content: data.message,
        type: 'text' as const,
        direction: 'out' as const,
        status: 'sent' as const,
        timestamp: new Date(),
      };
      
      // Simulate sending delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return newMessage;
    },
    onSuccess: (message) => {
      addMessage(message);
      
      // Simulate status updates
      setTimeout(() => {
        useAppStore.setState(state => ({
          messages: state.messages.map(m => 
            m.id === message.id ? { ...m, status: 'delivered' } : m
          ),
        }));
      }, 1000);
      
      setTimeout(() => {
        useAppStore.setState(state => ({
          messages: state.messages.map(m => 
            m.id === message.id ? { ...m, status: 'read' } : m
          ),
        }));
      }, 2000);
    },
    onError: (error) => {
      toast.error('Failed to send message');
    },
  });
}
