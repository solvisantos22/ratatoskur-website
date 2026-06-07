'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { appendPoint, normalizePointer, type Point } from './canvas-model';

type DrawingCanvasProps = {
  ariaLabel: string;
  privacyText?: string;
  clearSignal: number;
};

type SurfaceSize = {
  width: number;
  height: number;
};

const emptySize: SurfaceSize = { width: 0, height: 0 };

function drawStrokes(
  canvas: HTMLCanvasElement,
  strokes: readonly Point[][],
  size: SurfaceSize,
) {
  const context = canvas.getContext('2d');
  if (!context || size.width <= 0 || size.height <= 0) {
    return;
  }

  const pixelRatio = window.devicePixelRatio || 1;
  const backingWidth = Math.max(1, Math.round(size.width * pixelRatio));
  const backingHeight = Math.max(1, Math.round(size.height * pixelRatio));

  if (canvas.width !== backingWidth) {
    canvas.width = backingWidth;
  }
  if (canvas.height !== backingHeight) {
    canvas.height = backingHeight;
  }

  canvas.style.width = `${size.width}px`;
  canvas.style.height = `${size.height}px`;

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, size.width, size.height);
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.strokeStyle = '#3c1d11';
  context.lineWidth = 4;

  for (const stroke of strokes) {
    if (stroke.length === 0) {
      continue;
    }

    context.beginPath();
    context.moveTo(stroke[0].x * size.width, stroke[0].y * size.height);

    for (const point of stroke.slice(1)) {
      context.lineTo(point.x * size.width, point.y * size.height);
    }

    if (stroke.length === 1) {
      const point = stroke[0];
      context.lineTo(point.x * size.width + 0.01, point.y * size.height);
    }

    context.stroke();
  }
}

export function DrawingCanvas({
  ariaLabel,
  privacyText = 'Drawing stays on this device.',
  clearSignal,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const firstClearSignalRef = useRef(clearSignal);
  const activeStrokeIndexRef = useRef<number | null>(null);
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const [surfaceSize, setSurfaceSize] = useState<SurfaceSize>(emptySize);

  const measure = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    setSurfaceSize({ width: rect.width, height: rect.height });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    measure();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) {
        measure();
        return;
      }

      setSurfaceSize({ width: rect.width, height: rect.height });
    });

    observer.observe(canvas);

    return () => observer.disconnect();
  }, [measure]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    drawStrokes(canvas, strokes, surfaceSize);
  }, [strokes, surfaceSize]);

  useEffect(() => {
    if (clearSignal === firstClearSignalRef.current) {
      return;
    }

    setStrokes([]);
    activeStrokeIndexRef.current = null;
  }, [clearSignal]);

  const appendActivePoint = useCallback((point: Point) => {
    setStrokes((currentStrokes) => {
      const activeStrokeIndex = activeStrokeIndexRef.current;

      if (activeStrokeIndex === null) {
        return currentStrokes;
      }

      return currentStrokes.map((stroke, index) =>
        index === activeStrokeIndex ? appendPoint(stroke, point) : stroke,
      );
    });
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget;
    canvas.setPointerCapture?.(event.pointerId);

    const point = normalizePointer(event, canvas.getBoundingClientRect());
    setStrokes((currentStrokes) => {
      activeStrokeIndexRef.current = currentStrokes.length;
      return [...currentStrokes, [point]];
    });
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (activeStrokeIndexRef.current === null) {
      return;
    }

    appendActivePoint(
      normalizePointer(event, event.currentTarget.getBoundingClientRect()),
    );
  };

  const stopDrawing = () => {
    activeStrokeIndexRef.current = null;
  };

  return (
    <div
      style={{
        display: 'grid',
        gap: '0.55rem',
        width: '100%',
      }}
    >
      <canvas
        ref={canvasRef}
        aria-label={ariaLabel}
        onPointerCancel={stopDrawing}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDrawing}
        onLostPointerCapture={stopDrawing}
        style={{
          background: '#fff8ec',
          border: '1px solid rgba(60, 29, 17, 0.24)',
          borderRadius: '0.8rem',
          display: 'block',
          minHeight: '14rem',
          touchAction: 'none',
          width: '100%',
        }}
      />
      <p
        style={{
          color: '#684b3b',
          fontSize: '0.85rem',
          lineHeight: 1.45,
          margin: 0,
        }}
      >
        {privacyText}
      </p>
    </div>
  );
}
