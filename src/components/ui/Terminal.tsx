import React from 'react';

export function Terminal({ commands }: { commands: string[] }) {
  return (
    <div className="bg-black/50 border border-white/10 rounded-md p-4 font-mono text-xs text-green-500 text-left w-full max-w-sm">
      {commands.map((cmd, i) => (
        <div key={i} className="mb-1 opacity-80">
          {cmd}
        </div>
      ))}
      <div className="animate-pulse">_</div>
    </div>
  );
}
