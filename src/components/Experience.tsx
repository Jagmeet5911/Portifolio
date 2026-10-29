"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, MQ } from "@/lib/gsap";

/**
 * Site-wide feel: inertial smooth scrolling synced to ScrollTrigger, a scroll
 * progress hairline, and a pointer follower on precise pointers. All of it is
 * skipped under prefers-reduced-motion.
 */
export default function Experience() {
  const bar = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia(MQ.reduced).matches) return;

    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // In-page links glide instead of jumping.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!;
      const el = id === "#" ? null : document.querySelector<HTMLElement>(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: id === "#top" ? 0 : -80 });
      history.replaceState(null, "", id);
    };
    document.addEventListener("click", onClick);

    const progress = gsap.to(bar.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
    });

    let cleanupCursor = () => {};
    if (window.matchMedia("(pointer: fine)").matches && dot.current && ring.current) {
      document.documentElement.classList.add("has-cursor");
      const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
      const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
      const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3" });
      const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3" });
      const move = (e: PointerEvent) => {
        ring.current!.classList.remove("is-gone");
        document.documentElement.classList.add("cursor-on");
        dx(e.clientX);
        dy(e.clientY);
        rx(e.clientX);
        ry(e.clientY);
        const hot = (e.target as HTMLElement).closest("a, button, [data-cursor]");
        ring.current!.classList.toggle("is-hot", !!hot);
      };
      const hide = () => ring.current!.classList.add("is-gone");
      const show = () => ring.current!.classList.remove("is-gone");
      window.addEventListener("pointermove", move, { passive: true });
      document.addEventListener("pointerleave", hide);
      document.addEventListener("pointerenter", show);
      cleanupCursor = () => {
        document.documentElement.classList.remove("has-cursor", "cursor-on");
        window.removeEventListener("pointermove", move);
        document.removeEventListener("pointerleave", hide);
        document.removeEventListener("pointerenter", show);
      };
    }

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      document.removeEventListener("click", onClick);
      progress.scrollTrigger?.kill();
      progress.kill();
      cleanupCursor();
    };
  }, []);

  return (
    <>
      <div className="progress" aria-hidden="true">
        <div ref={bar} className="progress__bar" />
      </div>
      <div ref={ring} className="cursor-ring is-gone" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
