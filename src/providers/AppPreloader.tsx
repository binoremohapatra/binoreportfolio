'use client';

import { useEffect, useState, useLayoutEffect, useMemo } from 'react';
import { useLenis } from '@/hooks/useLenis';
import { usePreloader } from '@/hooks/usePreloader';
import { LoaderScreen } from '@/components/LoaderScreen';
import { preloadImageSequence, preloadFonts } from '@/lib/preload-assets';

// Define global interface for the preloaded frames
declare global {
  interface Window {
    __heroFrames?: (ImageBitmap | null)[];
  }
}

export function AppPreloader({ children }: { children: React.ReactNode }) {
  const lenis = useLenis();
  const [siteVisible, setSiteVisible] = useState(false);

  // Stop lenis as early as possible
  useLayoutEffect(() => {
    if (lenis && !siteVisible) {
      lenis.stop();
    }
  }, [lenis, siteVisible]);

  // Memoize tasks to prevent infinite re-renders in usePreloader
  const tasks = useMemo(() => [
    {
      label: 'hero-frames',
      weight: 3,
      load: async (p: (n: number) => void) => {
        // Check if frames are already cached in memory (prevents reloading on HMR or re-renders)
        if (typeof window !== 'undefined' && window.__heroFrames && window.__heroFrames[0]) {
          p(100);
          return;
        }

        // Fetch meta.json to get the correct frame count
        let frameCount = 300;
        try {
          const res = await fetch('/frames/hero/meta.json');
          if (res.ok) {
            const meta = await res.json();
            frameCount = meta.count || 300;
          }
        } catch (e) {
          console.warn("Could not fetch meta.json, defaulting to 300");
        }

        // Only preload the first 30 frames for the loading screen to be fast.
        // We will background stream the rest.
        const priorityCount = Math.min(30, frameCount);
        const urls = Array.from({ length: frameCount }, (_, i) =>
          `/frames/hero/frame_${String(i + 1).padStart(4, '0')}.jpg`
        );
        
        // Priority chunk
        const bitmaps: (ImageBitmap | null)[] = new Array(frameCount).fill(null);
        let loaded = 0;
        
        await Promise.all(
          urls.slice(0, priorityCount).map(async (url, i) => {
            try {
              const res = await fetch(url);
              if (res.ok) {
                const blob = await res.blob();
                bitmaps[i] = await createImageBitmap(blob);
              } else {
                throw new Error(`HTTP ${res.status} ${res.statusText}`);
              }
            } catch (e) {
              console.error('Failed to load priority frame', i, url, e);
            } finally {
              loaded++;
              p(Math.round((loaded / priorityCount) * 100));
            }
          })
        );
        
        window.__heroFrames = bitmaps;
        
        // Background stream the rest with higher concurrency so the user doesn't hit missing frames when scrolling
        const MAX_CONCURRENT = 6;
        let currentIdx = priorityCount;
        let activeRequests = 0;

        function processNext() {
          if (currentIdx >= frameCount) return; // Done
          
          while (activeRequests < MAX_CONCURRENT && currentIdx < frameCount) {
            const i = currentIdx++;
            activeRequests++;
            
            fetch(urls[i])
              .then(res => res.ok ? res.blob() : Promise.reject(new Error("HTTP " + res.status)))
              .then(blob => {
                 // Decode safely to avoid freezing UI
                 return new Promise<ImageBitmap>((resolve, reject) => {
                   if ('requestIdleCallback' in window) {
                     (window as any).requestIdleCallback(() => {
                       createImageBitmap(blob).then(resolve).catch(reject);
                     });
                   } else {
                     setTimeout(() => {
                       createImageBitmap(blob).then(resolve).catch(reject);
                     }, 10);
                   }
                 });
              })
              .then(bmp => {
                if (window.__heroFrames) window.__heroFrames[i] = bmp;
              })
              .catch(() => {}) // Ignore background fetch errors
              .finally(() => {
                activeRequests--;
                // Immediately chain the next one, no massive delay
                processNext(); 
              });
          }
        }
        
        // Start background stream slightly delayed to prioritize initial animations, but not 3.5s!
        setTimeout(processNext, 800);
      },
    },
    {
      label: 'fonts',
      weight: 1,
      load: (p: (n: number) => void) => preloadFonts(['Technor'], p),
    },
  ], []);

  const { progress, done } = usePreloader(tasks);

  function handleExitComplete() {
    setSiteVisible(true);
    if (lenis) {
      lenis.start();
    }
    // Also scroll to top just in case
    window.scrollTo(0, 0);
    // Force GSAP ScrollTrigger to recalculate now that elements are visible
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

  return (
    <>
      {!siteVisible && (
        <LoaderScreen progress={progress} done={done} onExitComplete={handleExitComplete} />
      )}
      <div style={{ visibility: done ? 'visible' : 'hidden' }}>{children}</div>
    </>
  );
}
