import React from 'react';

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export function Timeline({ data }: { data: TimelineEntry[] }) {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
      {data.map((item, index) => (
        <div key={index} className="flex gap-4">
          <div className="text-primary font-bold">{item.title}</div>
          <div>{item.content}</div>
        </div>
      ))}
    </div>
  );
}
