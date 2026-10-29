"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";

/** Endless ribbon of words that speeds up, reverses and skews with scroll velocity. */
export default function Marquee({ items, tone = "cobalt" }: { items: readonly string[]; tone?: "cobalt" | "ink" }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const track = root.current!.querySelector<HTMLElement>(".marquee__track")!;
        const loop = gsap.to(track, { xPercent: -50, ease: "none", duration: 38, repeat: -1 });
        const skew = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3" });
        let dir = 1;
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = self.getVelocity();
            if (self.direction !== dir) dir = self.direction;
            const boost = gsap.utils.clamp(1, 6, 1 + Math.abs(v) / 450);
            gsap.to(loop, { timeScale: dir * boost, duration: 0.3, overwrite: true });
            gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.3, ease: "power2.out" });
            skew(gsap.utils.clamp(-10, 10, v / -300));
          },
        });
        return () => st.kill();
      });
    },
    { scope: root },
  );

  const row = [...items, ...items];
  return (
    <div className={`marquee marquee--${tone}`} ref={root} aria-hidden="true">
      <div className="marquee__track">
        {[0, 1].map((k) => (
          <span className="marquee__group" key={k}>
            {row.map((t, i) => (
              <span className="marquee__item" key={`${k}-${i}`}>
                {t}
                <svg viewBox="0 0 16 16" width="0.5em" height="0.5em">
                  <path d="M8 0l1.8 6.2L16 8l-6.2 1.8L8 16l-1.8-6.2L0 8l6.2-1.8z" fill="currentColor" />
                </svg>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
