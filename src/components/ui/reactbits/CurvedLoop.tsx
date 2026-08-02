"use client";
// CurvedLoop – React Bits
// SVG textPath curved marquee with optional drag interaction
import { useRef, useEffect, useState, useMemo, useId } from "react";
import "./CurvedLoop.css";

interface CurvedLoopProps {
  marqueeText?: string;
  speed?: number;
  className?: string;
  curveAmount?: number;
  direction?: "left" | "right";
  interactive?: boolean;
}

const CurvedLoop = ({
  marqueeText = "",
  speed = 2,
  className,
  curveAmount = 400,
  direction = "left",
  interactive = true,
}: CurvedLoopProps) => {
  // Normalise: ensure exactly one trailing non-breaking space for seamless wrapping
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (hasTrailing ? marqueeText.replace(/\s+$/, "") : marqueeText) + "\u00A0";
  }, [marqueeText]);

  const measureRef = useRef<SVGTextElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const [spacing, setSpacing] = useState(0);
  const [, setOffset] = useState(0);

  const uid = useId();
  const pathId = `curve-${uid.replace(/:/g, "")}`;

  // SVG path: a gentle quadratic bezier
  const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;

  // Drag state
  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef(direction);
  const velRef = useRef(0);

  // Replicate text enough times to fill ~1800px
  const totalText = useMemo(() => {
    if (!spacing) return text;
    const copies = Math.ceil(1800 / spacing) + 2;
    return Array(copies).fill(text).join("");
  }, [text, spacing]);

  const ready = spacing > 0;

  // Measure single-copy width after first render
  useEffect(() => {
    if (measureRef.current) {
      setSpacing(measureRef.current.getComputedTextLength());
    }
  }, [text, className]);

  // Set initial offset to -spacing so loop wraps cleanly
  useEffect(() => {
    if (!spacing || !textPathRef.current) return;
    const initial = -spacing;
    textPathRef.current.setAttribute("startOffset", initial + "px");
    setOffset(initial);
  }, [spacing]);

  // Animation loop
  useEffect(() => {
    if (!spacing || !ready) return;
    let frame = 0;

    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === "right" ? speed : -speed;
        const cur = parseFloat(textPathRef.current.getAttribute("startOffset") || "0");
        let next = cur + delta;
        // Wrap seamlessly
        if (next <= -spacing) next += spacing;
        if (next > 0) next -= spacing;
        textPathRef.current.setAttribute("startOffset", next + "px");
        setOffset(next);
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed, ready]);

  // Drag / pointer interaction
  useEffect(() => {
    if (!interactive || !textPathRef.current) return;

    const svgEl = textPathRef.current.ownerSVGElement;
    if (!svgEl) return;

    const onPointerDown = (e: PointerEvent) => {
      dragRef.current = true;
      lastXRef.current = e.clientX;
      velRef.current = 0;
      svgEl.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragRef.current || !textPathRef.current) return;
      const dx = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      velRef.current = dx;
      const cur = parseFloat(textPathRef.current.getAttribute("startOffset") || "0");
      let next = cur + dx;
      if (next <= -spacing) next += spacing;
      if (next > 0) next -= spacing;
      textPathRef.current.setAttribute("startOffset", next + "px");
      setOffset(next);
      dirRef.current = dx > 0 ? "right" : "left";
    };

    const onPointerUp = () => {
      dragRef.current = false;
    };

    svgEl.addEventListener("pointerdown", onPointerDown);
    svgEl.addEventListener("pointermove", onPointerMove);
    svgEl.addEventListener("pointerup", onPointerUp);
    svgEl.addEventListener("pointercancel", onPointerUp);

    return () => {
      svgEl.removeEventListener("pointerdown", onPointerDown);
      svgEl.removeEventListener("pointermove", onPointerMove);
      svgEl.removeEventListener("pointerup", onPointerUp);
      svgEl.removeEventListener("pointercancel", onPointerUp);
    };
  }, [interactive, spacing]);

  return (
    <div className="curved-loop-container" aria-hidden="true">
      {/* Hidden measure element */}
      <svg
        style={{ position: "absolute", visibility: "hidden", pointerEvents: "none", width: 0, height: 0 }}
      >
        <defs>
          <path id={`${pathId}-measure`} d={pathD} />
        </defs>
        <text>
          <textPath ref={measureRef as any} href={`#${pathId}-measure`}>
            {text}
          </textPath>
        </text>
      </svg>

      {/* Visible SVG */}
      <svg
        className="curved-loop-svg"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        style={{ height: Math.max(60, curveAmount / 5) + 60 }}
      >
        <defs>
          <path id={pathId} d={pathD} />
        </defs>
        <text>
          <textPath
            ref={textPathRef}
            href={`#${pathId}`}
            startOffset="-999px"
            className={className}
            style={{ fontFamily: "inherit" }}
          >
            {ready ? totalText : ""}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default CurvedLoop;