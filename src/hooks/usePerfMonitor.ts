"use client";

/**
 * hooks/usePerfMonitor.ts
 *
 * Samples rolling average FPS using requestAnimationFrame.
 * Provides a `isHighPerf` flag that gates WebGL feature availability.
 *
 * ARCHITECTURE NOTE (Master Plan, Phase 3 / Part 5 "Frame Budget"):
 * - Below 45fps sustained for >2s → isHighPerf = false
 * - This triggers a global "reduced fidelity" state that disables:
 *   - Ch.III WebGL shelf → CSS carousel
 *   - Ch.IV Maeve AI interactive → video loop
 * - This is a PERFORMANCE safety net, separate from the accessibility
 *   reduced-motion system in ReducedMotionProvider.
 *
 * The hook shares the GSAP ticker RAF loop (already running via LenisProvider)
 * rather than creating an independent rAF subscription.
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface PerfMonitorState {
  fps: number;
  isHighPerf: boolean;
  isMidPerf: boolean;
  isLowPerf: boolean;
}

const SAMPLE_WINDOW = 60;  // frames to average
const LOW_PERF_THRESHOLD = 45;   // fps below this = low perf
const MID_PERF_THRESHOLD = 55;   // fps below this = mid perf
const LOW_PERF_SUSTAINED_MS = 2000; // must sustain low for 2s before flagging

export function usePerfMonitor(): PerfMonitorState {
  const [state, setState] = useState<PerfMonitorState>({
    fps: 60,
    isHighPerf: true,
    isMidPerf: false,
    isLowPerf: false,
  });

  const frameTimesRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(0);
  const lowPerfStartRef = useRef<number | null>(null);

  useEffect(() => {
    const sampleFn = (time: number) => {
      const now = performance.now();

      if (lastTimeRef.current > 0) {
        const delta = now - lastTimeRef.current;
        const instantFps = 1000 / delta;

        frameTimesRef.current.push(instantFps);
        if (frameTimesRef.current.length > SAMPLE_WINDOW) {
          frameTimesRef.current.shift();
        }

        if (frameTimesRef.current.length === SAMPLE_WINDOW) {
          const avgFps =
            frameTimesRef.current.reduce((a, b) => a + b, 0) / SAMPLE_WINDOW;

          const roundedFps = Math.round(avgFps);
          const isCurrentlyLow = avgFps < LOW_PERF_THRESHOLD;

          // Sustained low-perf detection: must be low for >2s
          if (isCurrentlyLow && lowPerfStartRef.current === null) {
            lowPerfStartRef.current = now;
          } else if (!isCurrentlyLow) {
            lowPerfStartRef.current = null;
          }

          const sustainedLow =
            isCurrentlyLow &&
            lowPerfStartRef.current !== null &&
            now - lowPerfStartRef.current > LOW_PERF_SUSTAINED_MS;

          setState({
            fps: roundedFps,
            isHighPerf: avgFps >= MID_PERF_THRESHOLD,
            isMidPerf: avgFps >= LOW_PERF_THRESHOLD && avgFps < MID_PERF_THRESHOLD,
            isLowPerf: sustainedLow,
          });
        }
      }

      lastTimeRef.current = now;
    };

    gsap.ticker.add(sampleFn);
    return () => gsap.ticker.remove(sampleFn);
  }, []);

  return state;
}
