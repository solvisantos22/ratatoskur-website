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

test('en and is message files have identical key sets', () => {
  expect(flatKeys(is).sort()).toEqual(flatKeys(en).sort());
});

test('public copy does not claim current funding or current teacher analytics', () => {
  expect(en.footer).not.toHaveProperty('fundedBy');
  expect(is.footer).not.toHaveProperty('fundedBy');
  expect(en.hood.i4Title).toBe('Future teacher insights');
  expect(is.hood.i4Title).toBe('Framtíðarsýn fyrir kennara');
});
