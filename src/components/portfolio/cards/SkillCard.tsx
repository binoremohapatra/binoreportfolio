import React from 'react';

interface SkillCardProps {
  label: string;
  category: string;
}

export function SkillCard({ label, category }: SkillCardProps) {
  return (
    <div className="px-4 py-2 bg-[#181a1b] rounded-xl border border-white/5 shadow-md flex items-center justify-between text-sm">
      <span className="text-white/90 font-medium">{label}</span>
      <span className="text-[#e0303d] text-[10px] uppercase font-mono tracking-wider">{category}</span>
    </div>
  );
}
