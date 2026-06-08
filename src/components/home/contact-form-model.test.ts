import { expect, test } from 'vitest';
import { normalizeServerIssues, validateContactDraft } from './contact-form-model';

const valid = {
  name: 'Anna',
  email: 'anna@school.is',
  organization: 'Menntaskoli',
  message: 'We would like to discuss a classroom pilot.',
  website: '',
};

test('validates the contact form before submit', () => {
  expect(validateContactDraft(valid)).toEqual({});
  expect(
    validateContactDraft({
      ...valid,
      name: ' ',
      email: 'not-an-email',
      organization: '',
      message: 'Too short',
      website: 'https://spam.example',
    }),
  ).toEqual({
    name: 'required',
    email: 'email',
    organization: 'required',
    message: 'messageLength',
    website: 'honeypot',
  });
});

test('normalizes known server validation issues to field errors', () => {
  expect(
    normalizeServerIssues({
      email: ['Enter a valid email'],
      message: ['Add a short message'],
      ignored: ['Unknown field'],
    }),
  ).toEqual({
    email: 'server',
    message: 'server',
  });
});
