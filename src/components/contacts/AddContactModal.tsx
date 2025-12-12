import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { contactSchema, ContactInput } from '@/lib/validations';
import { useCreateContact } from '@/hooks/useApi';
import { cn } from '@/lib/utils';

interface AddContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const availableTags = ['VIP', 'Customer', 'Lead', 'Prospect', 'Newsletter'];

export function AddContactModal({ open, onOpenChange }: AddContactModalProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const createContact = useCreateContact();

  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      tags: [],
    },
  });

  const onSubmit = async (data: ContactInput) => {
    try {
      await createContact.mutateAsync({
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        tags: selectedTags,
        customFields: data.customFields,
      });
      form.reset();
      setSelectedTags([]);
      onOpenChange(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags(prev => [...prev, customTag.trim()]);
      setCustomTag('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              {...form.register('name')}
              id="name"
              placeholder="John Smith"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              {...form.register('phone')}
              id="phone"
              placeholder="+1 (555) 123-4567"
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              {...form.register('email')}
              id="email"
              type="email"
              placeholder="john@example.com"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                  className={cn(
                    "cursor-pointer transition-colors",
                    selectedTags.includes(tag) && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* Custom tags */}
            {selectedTags.filter(t => !availableTags.includes(t)).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTags.filter(t => !availableTags.includes(t)).map(tag => (
                  <Badge
                    key={tag}
                    className="bg-accent text-accent-foreground gap-1"
                  >
                    {tag}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => toggleTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {/* Add custom tag */}
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add custom tag..."
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomTag();
                  }
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addCustomTag}
                disabled={!customTag.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={createContact.isPending}
            >
              {createContact.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Contact'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
