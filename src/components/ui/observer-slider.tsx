import React from 'react';

interface Slide {
  id: string;
  title: string;
  imageUrl: string;
}

interface ObserverSliderProps {
  slides: Slide[];
}

export function ObserverSlider({ slides }: ObserverSliderProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#0d0f12]">
      {slides.map((slide) => (
        <div key={slide.id} className="text-white/50 text-sm py-2">
          {slide.title}
        </div>
      ))}
    </div>
  );
}
