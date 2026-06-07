export type Point = {
  x: number;
  y: number;
};

type PointerLike = {
  clientX: number;
  clientY: number;
};

type RectLike = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function normalizePointer(pointer: PointerLike, rect: RectLike): Point {
  const x = rect.width > 0 ? (pointer.clientX - rect.left) / rect.width : 0;
  const y = rect.height > 0 ? (pointer.clientY - rect.top) / rect.height : 0;

  return {
    x: clamp(x),
    y: clamp(y),
  };
}

export function appendPoint(stroke: readonly Point[], point: Point): Point[] {
  return [...stroke, point];
}

export function shouldStartPointer(activePointerId: number | null) {
  return activePointerId === null;
}

export function isActivePointer(
  pointerId: number,
  activePointerId: number | null,
) {
  return activePointerId !== null && pointerId === activePointerId;
}
