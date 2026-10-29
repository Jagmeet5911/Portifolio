"use client";

import { gsap, ScrollTrigger, SplitText, useGSAP, MQ } from "@/lib/gsap";

/**
 * Page-wide scroll patterns, declared in markup:
 *   data-reveal       fade + rise when it enters
 *   data-split        heading revealed character by character, masked per line
 *   data-scrub-words  words fill from muted to ink as you scroll through
 *   data-count        number counts up from zero
 *   data-draw         SVG paths draw in
 *   data-magnetic     element leans toward the pointer
 *   data-spotlight    card lit by a soft light that follows the pointer
 */
export default function Motion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        onEnter: (els) =>
          gsap.fromTo(els, { y: 36, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08, duration: 1, ease: "power3.out", overwrite: true }),
      });
      // Hide only what is still below the fold, so nothing visible ever blinks.
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        if (el.getBoundingClientRect().top > window.innerHeight * 0.88) gsap.set(el, { autoAlpha: 0, y: 36 });
      });

      const splits: SplitText[] = [];
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        const split = SplitText.create(el, { type: "lines,chars", mask: "lines", linesClass: "split-line" });
        splits.push(split);
        gsap.from(split.chars, {
          yPercent: 115,
          rotate: 7,
          duration: 1.1,
          stagger: { each: 0.018 },
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-scrub-words]").forEach((el) => {
        const split = SplitText.create(el, { type: "words", wordsClass: "scrub-word" });
        splits.push(split);
        gsap.fromTo(
          split.words,
          { opacity: 0.18 },
          { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true } },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const raw = el.dataset.count ?? "";
        const m = raw.match(/^(\D*)([\d.]+)(.*)$/);
        if (!m) return;
        const [, pre, num, post] = m;
        const decimals = num.includes(".") ? num.split(".")[1].length : 0;
        const obj = { v: 0 };
        gsap.to(obj, {
          v: parseFloat(num),
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => (el.textContent = `${pre}${obj.v.toFixed(decimals)}${post}`),
        });
      });

      gsap.utils.toArray<SVGElement>("[data-draw]").forEach((svg) => {
        const paths = svg.querySelectorAll("[data-path]");
        const nodes = svg.querySelectorAll("[data-node]");
        // Once drawn, edges keep flowing and accent nodes breathe (CSS, via .is-live).
        const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: "top 78%", once: true }, onComplete: () => svg.classList.add("is-live") });
        tl.from(nodes, { autoAlpha: 0, scale: 0.85, transformOrigin: "50% 50%", stagger: 0.07, duration: 0.6 })
          .from(paths, { drawSVG: 0, stagger: 0.08, duration: 0.8, ease: "power2.inOut" }, 0.15);
      });

      return () => splits.forEach((s) => s.revert());
    });

    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const cleanups: (() => void)[] = [];
      // Light that follows the pointer across cards.
      gsap.utils.toArray<HTMLElement>("[data-spotlight]").forEach((el) => {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--mx", `${e.clientX - r.left}px`);
          el.style.setProperty("--my", `${e.clientY - r.top}px`);
        };
        el.addEventListener("pointermove", move);
        cleanups.push(() => el.removeEventListener("pointermove", move));
      });
      gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((el) => {
        const x = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
        const y = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          x((e.clientX - (r.left + r.width / 2)) * 0.18);
          y((e.clientY - (r.top + r.height / 2)) * 0.25);
        };
        const leave = () => {
          x(0);
          y(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
      return () => cleanups.forEach((c) => c());
    });

    // Fonts change line breaks; re-measure once they settle.
    document.fonts?.ready.then(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });
  });

  return null;
}
