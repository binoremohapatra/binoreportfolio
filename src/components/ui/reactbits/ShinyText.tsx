"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number;
  direction?: "left" | "right";
}

export default function ShinyText({
  text,
  className,
  speed = 3,
  direction = "right",
}: ShinyTextProps) {
  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent animate-shiny-text bg-[length:200%_100%]",
        // Hardcode the crimson gradient they asked for
        "bg-[linear-gradient(110deg,#e0303d,45%,#fff,55%,#e0303d)]",
        className
      )}
      style={{
        animationDuration: `${speed}s`,
        animationDirection: direction === "left" ? "reverse" : "normal",
      }}
    >
      {text}
    </span>
  );
}
