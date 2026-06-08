export type ContactFormValues = {
  name: string;
  email: string;
  organization: string;
  message: string;
  website: string;
};

export type ContactField = keyof ContactFormValues;

export type ContactErrorCode = 'email' | 'honeypot' | 'messageLength' | 'required' | 'server';

export type ContactFieldErrors = Partial<Record<ContactField, ContactErrorCode>>;

export const emptyContactForm: ContactFormValues = {
  name: '',
  email: '',
  organization: '',
  message: '',
  website: '',
};

const knownFields = new Set<ContactField>(['name', 'email', 'organization', 'message', 'website']);

export function validateContactDraft(values: ContactFormValues): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  const email = values.email.trim();

  if (!values.name.trim()) errors.name = 'required';
  if (!email) errors.email = 'required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'email';
  if (!values.organization.trim()) errors.organization = 'required';
  if (values.message.trim().length < 10) errors.message = 'messageLength';
  if (values.website) errors.website = 'honeypot';

  return errors;
}

export function normalizeServerIssues(issues: unknown): ContactFieldErrors {
  if (issues === null || typeof issues !== 'object') return {};

  const errors: ContactFieldErrors = {};
  for (const [field, messages] of Object.entries(issues)) {
    if (!knownFields.has(field as ContactField)) continue;
    if (Array.isArray(messages) && messages.length > 0) {
      errors[field as ContactField] = 'server';
    }
  }
  return errors;
}
