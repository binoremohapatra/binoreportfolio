import React from 'react';

interface CircularTextProps {
  text: string;
  size?: number;
  fontSize?: number;
  spinDuration?: number;
  className?: string;
}

export function CircularText({
  text,
  size = 100,
  fontSize = 12,
  spinDuration = 10,
  className = '',
}: CircularTextProps) {
  const radius = size / 2 - fontSize;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        animation: `spin ${spinDuration}s linear infinite`,
      }}
    >
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <path
            id="circlePath"
            d={`
              M ${size / 2}, ${size / 2}
              m -${radius}, 0
              a ${radius},${radius} 0 1,1 ${radius * 2},0
              a ${radius},${radius} 0 1,1 -${radius * 2},0
            `}
          />
        </defs>
        <text
          fill="currentColor"
          fontSize={fontSize}
          fontFamily="monospace"
          letterSpacing="0.2em"
        >
          <textPath href="#circlePath" textLength={circumference}>
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
