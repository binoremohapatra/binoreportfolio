"use client";

/**
 * chapters/contact/Contact.tsx
 *
 * CHAPTER VII — "CONTACT"
 * The Dispatch. A terminal-themed contact form and final footer sequence.
 */

import { useState, FormEvent, useRef, useEffect } from "react";
import { Notch, SplitText } from "@/components/ui";
import { Terminal } from "@/components/ui/Terminal";
import { CountUp } from "@/components/ui/CountUp";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isReducedMotionActive } = useReducedMotion();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status !== 'idle') return;

    setStatus('submitting');

    // Simulate terminal processing
    setTimeout(() => {
      setStatus('success');
      setInput("");

      // Reset after a while
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }, 1500);
  };

  useEffect(() => {
    if (isReducedMotionActive) return;

    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      gsap.fromTo(
        ".contact-reveal",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isReducedMotionActive]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background flex flex-col pt-32 pb-12 px-6 lg:px-24 justify-between border-t border-border/20">
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col justify-center">
        <div className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/20 select-none mb-12 contact-reveal">
          <span>07</span>
          <span className="mx-3 text-white/10">—</span>
          <span>The Dispatch</span>
        </div>

        <h2 className="font-serif text-5xl md:text-7xl text-primary mb-8 contact-reveal">
          <SplitText
            text="Initiate Handshake."
            delay={30}
            splitType="words"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
          />
        </h2>

        <p className="text-muted-foreground/60 max-w-xl text-lg mb-16 contact-reveal">
          Open to roles in engineering and architecture.
          Drop a signal below and I'll route it back.
        </p>

        <div className="flex flex-col lg:flex-row gap-12 contact-reveal">
          <Notch size={16} className="bg-graphite border border-border/40 cut-light p-8 max-w-2xl w-full relative">
            <BorderBeam duration={8} size={250} />
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50 mb-6 flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Terminal // Secure Connection Established
            </div>

            <form onSubmit={handleSubmit} className="relative z-10">
              <div className="flex items-center text-primary font-mono text-sm sm:text-base">
                <span className="text-green-500 mr-4">guest@binore:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={status !== 'idle'}
                  placeholder={status === 'idle' ? "Enter your message or email..." : ""}
                  className="bg-transparent border-none outline-none flex-1 text-primary placeholder:text-muted-foreground/30"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>

              {status === 'submitting' && (
                <div className="mt-4 text-muted-foreground/80 font-mono text-sm animate-pulse">
                  [PROCESS] Encrypting payload... Sending...
                </div>
              )}

              {status === 'success' && (
                <div className="mt-4 text-green-400 font-mono text-sm">
                  [SUCCESS] Signal received. Acknowledgment sent.
                </div>
              )}

              <button type="submit" className="hidden">Submit</button>
            </form>
          </Notch>

          <div className="flex-1 w-full flex flex-col justify-center items-center lg:items-end text-right">
            <div className="mb-8">
              <Terminal
                commands={[
                  "ssh root@binore.dev",
                  "authenticating...",
                  "access granted.",
                  "initiating handshake protocols..."
                ]}
              />
            </div>
            <div className="text-white/40 font-mono text-xs uppercase tracking-widest">
              System Connections: <CountUp to={1337} duration={3} className="text-primary font-bold ml-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Sequence */}
      <footer className="w-full mt-32 border-t border-border/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 contact-reveal">
        <div>
          © {new Date().getFullYear()} BINORE MOHAPATRA. ALL RIGHTS RESERVED.
        </div>

        <div className="flex gap-8">
          <a href="https://github.com/binore" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a>
          <a href="https://linkedin.com/in/binore" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">LinkedIn</a>
          <a href="https://twitter.com/binore" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Twitter</a>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          SYSTEM ONLINE
        </div>
      </footer>
    </div>
  );
}
            )}
          </Notch >

  <div className="flex-1 w-full flex flex-col justify-center items-center lg:items-end text-right">
    <div className="text-white/40 font-mono text-xs uppercase tracking-widest">
      System Connections: <span className="text-primary font-bold ml-2">1337</span>
    </div>
  </div>
        </div >
      </div >

  {/* Structural Rhyme: The Closing Line using SignalName */ }
  < div className = "mt-24 contact-reveal" >
    <SignalName standalone={true} />
      </div >

  {/* Footer Sequence */ }
  < footer className = "w-full mt-16 border-t border-border/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40 contact-reveal" >
        <div>
          © {new Date().getFullYear()} BINORE MOHAPATRA. ALL RIGHTS RESERVED.
        </div>
        
        <div className="flex gap-8">
          <a href="https://github.com/binore" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors p-2 -m-2">GitHub</a>
          <a href="https://linkedin.com/in/binore" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors p-2 -m-2">LinkedIn</a>
          <a href="https://twitter.com/binore" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors p-2 -m-2">Twitter</a>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          SYSTEM ONLINE
        </div>
      </footer >
    </div >
  );
}
