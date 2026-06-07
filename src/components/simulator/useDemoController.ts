'use client';

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';

import { initialDemoState, reduceDemo } from './demo-machine';
import type { DemoMode, DemoStage } from './demo-types';

export const stageDuration: Partial<Record<DemoStage, number>> = {
  writing: 2400,
  'checking-reading': 900,
  confirming: 2200,
  responding: 2200,
};

export function useDemoController() {
  const [state, dispatch] = useReducer(reduceDemo, initialDemoState);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [clearDrawingSignal, setClearDrawingSignal] = useState(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hasStartedRef = useRef(false);
  const inViewRef = useRef(false);
  const manualPausedRef = useRef(false);
  const reducedMotionRef = useRef(false);

  const clearDrawing = useCallback(() => {
    setClearDrawingSignal((signal) => signal + 1);
  }, []);

  const pause = useCallback(() => {
    manualPausedRef.current = true;
    dispatch({ type: 'PAUSE' });
  }, []);

  const resume = useCallback(() => {
    manualPausedRef.current = false;
    dispatch({ type: 'RESUME' });
  }, []);

  const replay = useCallback(() => {
    manualPausedRef.current = false;
    dispatch({ type: 'REPLAY' });
  }, []);

  const skip = useCallback(() => {
    manualPausedRef.current = false;
    dispatch({ type: 'SKIP' });
  }, []);

  const selectMode = useCallback((mode: DemoMode) => {
    dispatch({ type: 'SELECT_MODE', mode });
  }, []);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = () => {
      const shouldReduce = media.matches;
      reducedMotionRef.current = shouldReduce;
      setReducedMotion(shouldReduce);

      if (shouldReduce && inViewRef.current) {
        hasStartedRef.current = true;
        dispatch({ type: 'SKIP' });
      }
    };

    handleChange();
    media.addEventListener('change', handleChange);

    return () => {
      media.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry?.intersectionRatio ?? 0;
        const entered = ratio >= 0.55;
        const left = ratio < 0.2;

        if (left) {
          inViewRef.current = false;
          dispatch({ type: 'PAUSE' });
          return;
        }

        if (!entered) return;

        inViewRef.current = true;

        if (reducedMotionRef.current) {
          hasStartedRef.current = true;
          dispatch({ type: 'SKIP' });
          return;
        }

        if (!hasStartedRef.current) {
          hasStartedRef.current = true;
          dispatch({ type: 'START' });
          return;
        }

        if (
          !manualPausedRef.current &&
          document.visibilityState === 'visible'
        ) {
          dispatch({ type: 'RESUME' });
        }
      },
      { threshold: [0, 0.2, 0.55, 1] },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        dispatch({ type: 'PAUSE' });
        return;
      }

      if (!inViewRef.current) return;

      if (reducedMotionRef.current) {
        dispatch({ type: 'SKIP' });
        return;
      }

      if (!manualPausedRef.current) {
        dispatch({ type: 'RESUME' });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion && inViewRef.current && state.stage !== 'interactive') {
      dispatch({ type: 'SKIP' });
    }
  }, [reducedMotion, state.stage]);

  useEffect(() => {
    if (state.paused || reducedMotion) return;

    const duration = stageDuration[state.stage];
    if (duration === undefined) return;

    // Reducer transitions are pure; this hook owns browser visibility and timers.
    const timeout = window.setTimeout(() => {
      dispatch({ type: 'ADVANCE' });
    }, duration);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [reducedMotion, state.paused, state.stage, state.runId]);

  return {
    state,
    rootRef,
    reducedMotion,
    pause,
    resume,
    replay,
    skip,
    selectMode,
    clearDrawingSignal,
    clearDrawing,
  };
}
