export async function preloadImageSequence(
  urls: string[],
  onProgress: (pct: number) => void
): Promise<(ImageBitmap | null)[]> {
  const bitmaps: (ImageBitmap | null)[] = new Array(urls.length).fill(null);
  let loaded = 0;

  await Promise.all(
    urls.map(async (url, i) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        bitmaps[i] = await createImageBitmap(blob);
      } catch (err) {
        console.error(`Failed to load frame ${i}: ${url}`, err);
      } finally {
        loaded++;
        onProgress(Math.round((loaded / urls.length) * 100));
      }
    })
  );
  return bitmaps;
}

export async function preloadFonts(
  families: string[],
  onProgress: (pct: number) => void
): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) {
    onProgress(100);
    return;
  }
  
  try {
    await Promise.all(families.map((f) => document.fonts.load(`700 32px "${f}"`)));
    await document.fonts.ready;
  } catch (err) {
    console.error("Failed to preload fonts", err);
  } finally {
    onProgress(100);
  }
}
