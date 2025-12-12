import { create } from 'zustand';
import { Contact, Message, Campaign, Template } from '@/types';
import { mockContacts, mockMessages, mockCampaigns, mockTemplates } from '@/lib/mockData';

interface AppState {
  // Contacts
  contacts: Contact[];
  selectedContact: Contact | null;
  setSelectedContact: (contact: Contact | null) => void;
  
  // Messages
  messages: Message[];
  addMessage: (message: Message) => void;
  
  // Campaigns
  campaigns: Campaign[];
  
  // Templates
  templates: Template[];
  
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initialize with mock data
  contacts: mockContacts,
  selectedContact: null,
  setSelectedContact: (contact) => set({ selectedContact: contact }),
  
  messages: mockMessages,
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  
  campaigns: mockCampaigns,
  templates: mockTemplates,
  
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  theme: 'light',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  }),
}));
