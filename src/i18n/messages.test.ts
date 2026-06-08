import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
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

function messageSources() {
  return [
    readFileSync(new URL('../../messages/en.json', import.meta.url), 'utf8'),
    readFileSync(new URL('../../messages/is.json', import.meta.url), 'utf8'),
  ].join('\n');
}

test('en and is message files have identical key sets', () => {
  expect(flatKeys(is).sort()).toEqual(flatKeys(en).sort());
});

test('public messages do not contain mojibake artifacts', () => {
  const publicCopy = [...stringValues(en), ...stringValues(is)].join('\n');
  const mojibakeArtifacts = [/Ã/, /â€¦/, /�/u];

  for (const artifact of mojibakeArtifacts) {
    expect(messageSources()).not.toMatch(artifact);
    expect(publicCopy).not.toMatch(artifact);
  }
});

test('public messages avoid prohibited people, funding, analytics, and internal copy', () => {
  expect(en.footer).not.toHaveProperty('fundedBy');
  expect(is.footer).not.toHaveProperty('fundedBy');

  const publicCopy = [...stringValues(en), ...stringValues(is)].join('\n');
  const prohibitedClaims = [
    /Sævar/i,
    /Saevar/i,
    /Tækniþróunarsjóður\s+Fræ/i,
    /\bFræ\b.{0,80}\b(support|supported|fund|funded|funding|grant)\b/i,
    /\b(support|supported|fund|funded|funding|grant)\b.{0,80}\bFræ\b/i,
    /\bFræ\b.{0,80}\b(stutt|styður|styrkur|styrkt|fjármagnað|fjármögnun)\b/i,
    /\b(stutt|styður|styrkur|styrkt|fjármagnað|fjármögnun)\b.{0,80}\bFræ\b/i,
    /\b(currently|now|today)\b.{0,80}\b(supported|funded|funding)\b/i,
    /\b(núna|í dag|sem stendur)\b.{0,80}\b(stutt|styrkt|fjármagnað)\b/i,
    /\b(analytics for teachers|teacher analytics|teacher dashboard|teacher insights)\b/i,
    /\btracked for teachers and researchers\b/i,
    /\b(greiningar fyrir kennara|kennaramælaborð|innsýn fyrir kennara)\b/i,
    /\bfylgst með fyrir kennara og rannsakendur\b/i,
    /\b(temporary|placeholder|redesign|rebuilt|navigable)\b/i,
    /\b(bráðabirgða|endurhönnun|endurbyggt)\b/i,
  ];

  for (const claim of prohibitedClaims) {
    expect(publicCopy).not.toMatch(claim);
  }
});
