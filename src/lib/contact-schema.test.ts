import { test, expect } from 'vitest';
import { contactSchema } from './contact-schema';

const valid = { name: 'Anna', email: 'anna@school.is', organization: 'Menntaskóli', message: 'We would like a pilot.', website: '' };

test('accepts a valid submission', () => {
  expect(contactSchema.safeParse(valid).success).toBe(true);
});
test('rejects an invalid email', () => {
  expect(contactSchema.safeParse({ ...valid, email: 'nope' }).success).toBe(false);
});
test('rejects an empty message', () => {
  expect(contactSchema.safeParse({ ...valid, message: '' }).success).toBe(false);
});
test('rejects when honeypot is filled', () => {
  expect(contactSchema.safeParse({ ...valid, website: 'http://spam' }).success).toBe(false);
});
