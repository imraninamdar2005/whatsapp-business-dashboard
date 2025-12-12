import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Send,
  Image,
  FileText,
  Mic,
  Check,
  CheckCheck,
  ArrowLeft
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';
import { Message } from '@/types';

const Chats = () => {
  const { contacts, messages, selectedContact, setSelectedContact, addMessage } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const contactMessages = messages.filter(m => m.contactId === selectedContact?.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [contactMessages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedContact) return;

    const newMessage: Message = {
      id: `m${Date.now()}`,
      contactId: selectedContact.id,
      content: messageInput,
      type: 'text',
      direction: 'out',
      status: 'sent',
      timestamp: new Date(),
    };

    addMessage(newMessage);
    setMessageInput('');

    // Simulate status updates
    setTimeout(() => {
      // In real app, update message status via API
    }, 1000);
  };

  const formatMessageTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday ' + format(date, 'HH:mm');
    }
    return format(date, 'MMM d, HH:mm');
  };

  const MessageStatus = ({ status }: { status: string }) => {
    switch (status) {
      case 'sent':
        return <Check className="w-3.5 h-3.5 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="w-3.5 h-3.5 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="w-3.5 h-3.5 text-accent" />;
      default:
        return null;
    }
  };

  const handleContactSelect = (contact: typeof contacts[0]) => {
    setSelectedContact(contact);
    setShowMobileChat(true);
  };

  return (
    <MainLayout>
      <div className="h-[calc(100vh-0px)] flex">
        {/* Contacts List */}
        <div className={cn(
          "w-full md:w-96 border-r border-border bg-card flex flex-col",
          showMobileChat && "hidden md:flex"
        )}>
          {/* Header */}
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">Chats</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredContacts.map((contact) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => handleContactSelect(contact)}
                className={cn(
                  "flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b border-border/50",
                  selectedContact?.id === contact.id && "bg-muted"
                )}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {contact.status === 'active' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-foreground truncate">{contact.name}</p>
                    {contact.lastMessageTime && (
                      <span className="text-xs text-muted-foreground">
                        {format(contact.lastMessageTime, 'HH:mm')}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">
                      {contact.lastMessage || 'No messages yet'}
                    </p>
                    {contact.unreadCount && contact.unreadCount > 0 && (
                      <Badge className="bg-accent text-accent-foreground h-5 min-w-[20px] flex items-center justify-center text-xs">
                        {contact.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={cn(
          "flex-1 flex flex-col bg-whatsapp-chat-bg",
          !showMobileChat && !selectedContact && "hidden md:flex"
        )}>
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setShowMobileChat(false)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={selectedContact.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {selectedContact.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{selectedContact.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedContact.status === 'active' ? 'Online' : 'Last seen recently'}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                <AnimatePresence>
                  {contactMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "flex",
                        message.direction === 'out' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[75%] rounded-lg px-3 py-2 shadow-sm",
                          message.direction === 'out'
                            ? "bg-whatsapp-message-out rounded-tr-sm"
                            : "bg-whatsapp-message-in rounded-tl-sm"
                        )}
                      >
                        <p className="text-foreground text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                        <div className={cn(
                          "flex items-center gap-1 mt-1",
                          message.direction === 'out' ? 'justify-end' : 'justify-start'
                        )}>
                          <span className="text-[10px] text-muted-foreground">
                            {formatMessageTime(message.timestamp)}
                          </span>
                          {message.direction === 'out' && (
                            <MessageStatus status={message.status} />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 bg-card border-t border-border">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground flex-shrink-0">
                    <Smile className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground flex-shrink-0">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  {messageInput.trim() ? (
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      className="bg-primary hover:bg-primary/90 flex-shrink-0"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground flex-shrink-0">
                      <Mic className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Send className="w-10 h-10 text-primary-foreground" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  WhatsApp Business Web
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Select a contact to start messaging. Send and receive messages directly from your dashboard.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Chats;
