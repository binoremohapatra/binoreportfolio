import React, { RefObject } from 'react';

interface VariableProximityProps {
  label: string;
  containerRef: RefObject<HTMLDivElement | null>;
  radius?: number;
  falloff?: string;
  fromFontVariationSettings?: string;
  toFontVariationSettings?: string;
  className?: string;
}

export function VariableProximity({
  label,
  className,
}: VariableProximityProps) {
  return <span className={className}>{label}</span>;
}
