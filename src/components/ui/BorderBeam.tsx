import React from 'react';

export function BorderBeam({
  duration,
  size,
  className,
}: {
  duration?: number;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`absolute inset-0 border border-white/10 pointer-events-none z-0 rounded-[inherit] ${
        className || ''
      }`}
    />
  );
}
