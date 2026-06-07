import { test, expect } from 'vitest';
import en from '../../messages/en.json';
import is from '../../messages/is.json';

function flatKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    return v && typeof v === 'object' && !Array.isArray(v)
      ? flatKeys(v as Record<string, unknown>, key)
      : [key];
  });
}

function stringValues(obj: Record<string, unknown>): string[] {
  return Object.values(obj).flatMap((value) =>
    value && typeof value === 'object' && !Array.isArray(value)
      ? stringValues(value as Record<string, unknown>)
      : typeof value === 'string'
        ? [value]
        : [],
  );
}

test('en and is message files have identical key sets', () => {
  expect(flatKeys(is).sort()).toEqual(flatKeys(en).sort());
});

test('public copy does not claim current funding or current teacher analytics', () => {
  expect(en.footer).not.toHaveProperty('fundedBy');
  expect(is.footer).not.toHaveProperty('fundedBy');

  const publicCopy = [...stringValues(en), ...stringValues(is)].join('\n');
  const prohibitedClaims = [
    /supported by Tækniþróunarsjóður Fræ/i,
    /stutt af Tækniþróunarsjóði Fræ/i,
    /analytics for teachers/i,
    /tracked for teachers and researchers/i,
    /greiningar fyrir kennara/i,
    /fylgst með fyrir kennara og rannsakendur/i,
  ];

  for (const claim of prohibitedClaims) {
    expect(publicCopy).not.toMatch(claim);
  }
});
