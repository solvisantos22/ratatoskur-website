'use client';

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';

import { demoTimeline, initialDemoState, reduceDemo } from './demo-machine';
import type { DemoMode, DemoStage } from './demo-types';

export const stageDuration: Partial<Record<DemoStage, number>> = {
  writing: 2600,
  'checking-reading': 900,
  responding: 2200,
};

export function useDemoController() {
  const [state, dispatch] = useReducer(reduceDemo, initialDemoState);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);
  const hasStartedRef = useRef(false);
  const inViewRef = useRef(false);
  const manualPausedRef = useRef(false);
  const reducedMotionRef = useRef(false);

  const rootRef = useCallback((node: HTMLDivElement | null) => {
    setRootElement(node);
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

  const previousStep = useCallback(() => {
    manualPausedRef.current = true;
    dispatch({ type: 'PREVIOUS_STEP' });
  }, []);

  const nextStep = useCallback(() => {
    manualPausedRef.current = true;
    dispatch({ type: 'NEXT_STEP' });
  }, []);

  const selectMode = useCallback((mode: DemoMode) => {
    manualPausedRef.current = true;
    dispatch({ type: 'SELECT_MODE', mode });
  }, []);

  const dismissResponse = useCallback(() => {
    dispatch({ type: 'DISMISS_RESPONSE' });
  }, []);

  const confirmReading = useCallback(() => {
    manualPausedRef.current = false;
    dispatch({ type: 'CONFIRM_READING' });
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

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', handleChange);

      return () => {
        media.removeEventListener('change', handleChange);
      };
    }

    media.addListener(handleChange);

    return () => {
      media.removeListener(handleChange);
    };
  }, []);

  useEffect(() => {
    if (!rootElement) return;

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

    observer.observe(rootElement);

    return () => {
      observer.disconnect();
    };
  }, [rootElement]);

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
  }, [reducedMotion, state.paused, state.stage, state.timelineIndex, state.runId]);

  return {
    state,
    rootRef,
    reducedMotion,
    canGoPrevious: state.timelineIndex > 0,
    canGoNext: state.timelineIndex < demoTimeline.length - 1,
    totalSteps: demoTimeline.length,
    pause,
    resume,
    replay,
    skip,
    previousStep,
    nextStep,
    confirmReading,
    dismissResponse,
    selectMode,
  };
}
