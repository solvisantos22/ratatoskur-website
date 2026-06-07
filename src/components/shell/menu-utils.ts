export const PANEL_FOCUSABLE_SELECTOR =
  [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

export function composePathWithQueryAndHash(
  pathname: string,
  search: string,
  hash: string,
) {
  const normalizedSearch = search.startsWith('?') ? search.slice(1) : search;
  const query = normalizedSearch ? `?${normalizedSearch}` : '';
  const fragment = hash ? (hash.startsWith('#') ? hash : `#${hash}`) : '';

  return `${pathname}${query}${fragment}`;
}

export function nextFocusIndex(
  currentIndex: number,
  focusableCount: number,
  direction: 1 | -1,
) {
  if (focusableCount <= 0) {
    return -1;
  }

  return (currentIndex + direction + focusableCount) % focusableCount;
}
