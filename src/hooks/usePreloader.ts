'use client';

import { useEffect, useRef, useState } from 'react';

export interface AssetTask {
  label: string;
  weight: number; // heavier assets (video frames) count more toward overall %
  load: (onProgress: (pct: number) => void) => Promise<void>;
}

export function usePreloader(tasks: AssetTask[]) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const progressMap = useRef<Record<string, number>>({});

  useEffect(() => {
    if (tasks.length === 0) {
      setDone(true);
      return;
    }

    const totalWeight = tasks.reduce((s, t) => s + t.weight, 0);

    function recompute() {
      const sum = tasks.reduce((s, t) => {
        const p = progressMap.current[t.label] ?? 0;
        return s + p * t.weight;
      }, 0);
      setProgress(Math.min(100, Math.round(sum / totalWeight)));
    }

    Promise.all(
      tasks.map((t) =>
        t.load((pct) => {
          progressMap.current[t.label] = pct;
          recompute();
        }).then(() => {
          progressMap.current[t.label] = 100;
          recompute();
        })
      )
    ).then(() => setDone(true));
  }, [tasks]);

  return { progress, done };
}
