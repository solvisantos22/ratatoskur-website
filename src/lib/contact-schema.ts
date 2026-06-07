import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Enter a valid email').max(200),
  organization: z.string().trim().min(1, 'Tell us your school or role').max(150),
  message: z.string().trim().min(10, 'Add a short message').max(2000),
  // Honeypot: real users leave this empty. Any content fails validation.
  website: z.string().max(0, 'Spam detected').optional().default(''),
});

export type ContactInput = z.infer<typeof contactSchema>;
