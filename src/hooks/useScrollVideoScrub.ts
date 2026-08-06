'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export async function preloadFrames(urls: string[], onProgress?: (n: number) => void) {
  const bitmaps: (ImageBitmap | null)[] = new Array(urls.length).fill(null);

  async function loadOne(i: number) {
    try {
      const res = await fetch(urls[i]);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      bitmaps[i] = await createImageBitmap(blob);
    } catch (err) {
      console.error(`Failed to load frame ${i}: ${urls[i]}`, err);
    }
    onProgress?.(i);
  }

  // Priority window first (synchronously wait for the first 30 frames)
  const priorityCount = Math.min(30, urls.length);
  await Promise.all(Array.from({ length: priorityCount }, (_, i) => loadOne(i)));

  // Background stream the rest with strict concurrency limits to prevent network saturation
  const MAX_CONCURRENT = 4;
  let currentIdx = priorityCount;
  let activeRequests = 0;

  function processNext() {
    if (currentIdx >= urls.length) return; // Done
    
    while (activeRequests < MAX_CONCURRENT && currentIdx < urls.length) {
      const i = currentIdx++;
      activeRequests++;
      
      loadOne(i).finally(() => {
        activeRequests--;
        processNext(); // Chain the next one
      });
    }
  }
  
  // Start background stream, slightly delayed
  setTimeout(processNext, 1000);

  return bitmaps;
}

export function useScrollVideoScrub(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  bitmaps: (ImageBitmap | null)[],
  triggerEl: React.RefObject<HTMLElement | null>,
  options?: {
    start?: string;
    end?: string;
    scrub?: boolean | number;
    onUpdate?: (progress: number) => void;
  }
) {
  const lastFrame = useRef(-1);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!bitmaps.length || !canvasRef.current || !triggerEl.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    
    // Cap DPR to 2 to avoid over-rendering on very high DPI screens like mobile 3x
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas) return;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      draw(lastFrame.current === -1 ? 0 : lastFrame.current, true);
    }

    function draw(frameIndex: number, force = false) {
      if (frameIndex === lastFrame.current && !force) return; // skip redundant paints
      if (frameIndex < 0 || frameIndex >= bitmaps.length) return;
      
      const bmp = bitmaps[frameIndex];
      if (!bmp || !ctx) return;
      
      const canvasAspectRatio = canvas.width / canvas.height;
      const imageAspectRatio = bmp.width / bmp.height;
      let renderableWidth, renderableHeight, xStart, yStart;

      if (imageAspectRatio < canvasAspectRatio) {
        renderableWidth = canvas.width;
        renderableHeight = bmp.height * (renderableWidth / bmp.width);
        xStart = 0;
        yStart = (canvas.height - renderableHeight) / 2;
      } else {
        renderableHeight = canvas.height;
        renderableWidth = bmp.width * (renderableHeight / bmp.height);
        xStart = (canvas.width - renderableWidth) / 2;
        yStart = 0;
      }

      ctx.fillStyle = '#0d0f12';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bmp, xStart, yStart, renderableWidth, renderableHeight);
      
      lastFrame.current = frameIndex;
    }

    // Capture initial options for ScrollTrigger creation
    const initialOptions = optionsRef.current || {};

    const st = ScrollTrigger.create({
      trigger: triggerEl.current,
      start: initialOptions.start || 'top top',
      end: initialOptions.end || 'bottom bottom',
      scrub: initialOptions.scrub !== undefined ? initialOptions.scrub : true,
      onUpdate: (self) => {
        if (optionsRef.current?.onUpdate) {
          optionsRef.current.onUpdate(self.progress);
        }
        
        const frameIndex = Math.round(self.progress * (bitmaps.length - 1));
        requestAnimationFrame(() => draw(frameIndex));
      },
    });

    // Force a ScrollTrigger refresh after a short delay to fix Next.js Fast Refresh (HMR) height bugs
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    window.addEventListener('resize', resize);
    resize(); // initial draw

    return () => {
      clearTimeout(refreshTimer);
      st.kill();
      window.removeEventListener('resize', resize);
    };
  }, [bitmaps, canvasRef, triggerEl]); // Removed options from dependencies
}
