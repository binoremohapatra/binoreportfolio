import React, { ReactNode } from 'react';

export function Dock({
  children,
  direction,
}: {
  children: ReactNode;
  direction?: string;
}) {
  return (
    <div className="flex items-center gap-2 bg-[#181a1b]/80 backdrop-blur-md p-2 rounded-2xl border border-white/10">
      {children}
    </div>
  );
}

export function DockIcon({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="p-3 rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white"
    >
      {children}
    </button>
  );
}
