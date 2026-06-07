import { describe, expect, test } from 'vitest';

import {
  appendPoint,
  isActivePointer,
  shouldStartPointer,
  normalizePointer,
} from './canvas-model';

describe('canvas model', () => {
  test('normalizes pointer coordinates into the drawing surface', () => {
    const point = normalizePointer(
      { clientX: 150, clientY: 90 },
      { left: 100, top: 50, width: 200, height: 100 },
    );

    expect(point).toEqual({ x: 0.25, y: 0.4 });
  });

  test('clamps pointer coordinates to the drawing surface', () => {
    const point = normalizePointer(
      { clientX: 500, clientY: -20 },
      { left: 100, top: 50, width: 200, height: 100 },
    );

    expect(point).toEqual({ x: 1, y: 0 });
  });

  test('appendPoint returns a new stroke and leaves the original untouched', () => {
    const original = [{ x: 0.1, y: 0.2 }];
    const next = appendPoint(original, { x: 0.25, y: 0.4 });

    expect(next).toEqual([
      { x: 0.1, y: 0.2 },
      { x: 0.25, y: 0.4 },
    ]);
    expect(next).not.toBe(original);
    expect(original).toHaveLength(1);
  });

  test('normalizes to the origin when the surface has no usable size', () => {
    const point = normalizePointer(
      { clientX: 150, clientY: 90 },
      { left: 100, top: 50, width: 0, height: -1 },
    );

    expect(point).toEqual({ x: 0, y: 0 });
  });

  test('starts a pointer only when no pointer is active', () => {
    expect(shouldStartPointer(null)).toBe(true);
    expect(shouldStartPointer(8)).toBe(false);
  });

  test('matches events against the active pointer', () => {
    expect(isActivePointer(8, 8)).toBe(true);
    expect(isActivePointer(9, 8)).toBe(false);
    expect(isActivePointer(8, null)).toBe(false);
  });
});
