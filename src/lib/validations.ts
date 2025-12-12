import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Contact schemas
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must be less than 20 digits')
    .regex(/^[\d\s\-+()]+$/, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  customFields: z.record(z.string(), z.string()).optional(),
});

// Message schemas
export const messageSchema = z.object({
  phone: z.string().min(10, 'Phone number is required'),
  message: z.string()
    .min(1, 'Message cannot be empty')
    .max(4096, 'Message must be less than 4096 characters'),
  mediaUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

export const templateMessageSchema = z.object({
  phone: z.string().min(10, 'Phone number is required'),
  templateId: z.string().min(1, 'Please select a template'),
  parameters: z.record(z.string(), z.string()),
});

// Campaign schemas
export const campaignSchema = z.object({
  name: z.string()
    .min(3, 'Campaign name must be at least 3 characters')
    .max(100, 'Campaign name must be less than 100 characters'),
  templateId: z.string().min(1, 'Please select a template'),
  sheetName: z.string().optional(),
  contactIds: z.array(z.string()).optional(),
  scheduledAt: z.string().optional(),
}).refine((data) => data.sheetName || (data.contactIds && data.contactIds.length > 0), {
  message: 'Please select contacts from a sheet or choose specific contacts',
  path: ['contactIds'],
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type TemplateMessageInput = z.infer<typeof templateMessageSchema>;
export type CampaignInput = z.infer<typeof campaignSchema>;
