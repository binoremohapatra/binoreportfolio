import React from 'react';

export function CountUp({
  to,
  duration,
  className,
}: {
  to: number;
  duration?: number;
  className?: string;
}) {
  return <span className={className}>{to}</span>;
}
