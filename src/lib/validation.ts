import { z } from 'zod'

// honeypot field name shared by both forms — bots that fill every input trip this
export const HONEYPOT_FIELD = 'company_website'

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(200),
  email: z.string().trim().email('Enter a valid email'),
  phone: z.string().trim().max(50).optional().or(z.literal('')),
  company: z.string().trim().max(200).optional().or(z.literal('')),
  interest: z.string().trim().max(200).optional().or(z.literal('')),
  message: z.string().trim().min(10, 'Tell us a bit more about your project').max(5000),
  consent: z.literal('on', { message: 'Please confirm you consent to us storing your details' }),
  [HONEYPOT_FIELD]: z.string().max(0).optional().or(z.literal('')),
})

export const applicationSchema = z.object({
  applicantName: z.string().trim().min(2, 'Enter your name').max(200),
  email: z.string().trim().email('Enter a valid email'),
  phone: z.string().trim().max(50).optional().or(z.literal('')),
  position: z.string().trim().min(1, 'Select a position'),
  coverMessage: z.string().trim().max(5000).optional().or(z.literal('')),
  consent: z.literal('on', { message: 'Please confirm you consent to us storing your details' }),
  [HONEYPOT_FIELD]: z.string().max(0).optional().or(z.literal('')),
})

export const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024
export const ALLOWED_CV_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

export type ContactInput = z.infer<typeof contactSchema>
export type ApplicationInput = z.infer<typeof applicationSchema>
