"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { heroStats, profile } from "@/data/site";
import { portrait } from "@/data/assets";
import { Button } from "./ui";

// three.js only loads in the browser, after the intro, when WebGL and motion are allowed.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const WORD = "ENGINEER";
const PILLS = [
  { text: "LLM agents", cls: "pill--a" },
  { text: "Payments & licensing", cls: "pill--b" },
  { text: "Microservices", cls: "pill--c" },
];

function canUseWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [scene, setScene] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia(MQ.reduced).matches;
    if (reduce || !canUseWebGL()) return;
    // Defer the WebGL bundle until the browser is idle so it never competes with first paint.
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    const go = () => setScene(true);
    if (w.requestIdleCallback) w.requestIdleCallback(go);
    else setTimeout(go, 600);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.set(".hero__arch", { autoAlpha: 1 })
          .fromTo(".hero__arch-bg", { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4 })
          .fromTo(".hero__portrait", { yPercent: 18, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.4 }, 0.25)
          .fromTo(".hero__word span", { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, stagger: 0.045, duration: 1.2 }, 0.1)
          .fromTo(".hero__hey, .hero__title-line, .hero__intro, .hero__ctas",
            { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.08, duration: 1.1 }, 0.55)
          .fromTo(".pill", { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, stagger: 0.1, ease: "back.out(1.8)", duration: 0.8 }, 0.9)
          .fromTo(".hero__stat", { x: 30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, stagger: 0.1, duration: 1 }, 0.95)
          .fromTo(".hero__cue", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 1.4);

        // Gentle float on the tags.
        gsap.utils.toArray<HTMLElement>(".pill").forEach((p, i) => {
          gsap.to(p, { y: i % 2 ? 8 : -8, rotation: `+=${i % 2 ? 2 : -2}`, duration: 3 + i * 0.6, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.6 });
        });

        // Scroll-out: the word slides away, the arch recedes, tags scatter, copy lifts.
        const out = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 },
        });
        out.to(".hero__word", { xPercent: -18 }, 0)
          .to(".hero__arch", { yPercent: 10, scale: 0.88 }, 0)
          .to(".hero__arch-bg", { borderRadius: "48px 48px 0 0" }, 0)
          .to(".pill-wrap.pill--a", { xPercent: -140, yPercent: -120, rotation: -18, autoAlpha: 0 }, 0)
          .to(".pill-wrap.pill--b", { xPercent: 120, yPercent: -160, rotation: 16, autoAlpha: 0 }, 0)
          .to(".pill-wrap.pill--c", { xPercent: 140, yPercent: 80, rotation: -10, autoAlpha: 0 }, 0)
          .to(".hero__copy", { yPercent: -18 }, 0)
          .to(".hero__stats", { yPercent: -40 }, 0);
      });

      mm.add(MQ.reduced, () => {
        gsap.set(".hero [data-intro]", { autoAlpha: 1 });
      });

      // Pointer parallax on devices with a precise pointer.
      mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const el = root.current!;
        const qx = gsap.quickTo(".hero__word", "x", { duration: 1.2, ease: "power3" });
        const pills = gsap.utils.toArray<HTMLElement>(".pill-wrap").map((p, i) => ({
          x: gsap.quickTo(p, "x", { duration: 1 + i * 0.2, ease: "power3" }),
          y: gsap.quickTo(p, "y", { duration: 1 + i * 0.2, ease: "power3" }),
          depth: 14 + i * 8,
        }));
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          qx(nx * -30);
          pills.forEach((p) => {
            p.x(nx * p.depth);
            p.y(ny * p.depth);
          });
        };
        el.addEventListener("pointermove", onMove);
        return () => el.removeEventListener("pointermove", onMove);
      });
    },
    { scope: root },
  );

  return (
    <section className="hero" id="top" ref={root} aria-labelledby="hero-title">
      <div className="hero__stage">
        <p className="hero__word" aria-hidden="true">
          {WORD.split("").map((ch, i) => (
            <span key={i} data-intro>
              {ch}
            </span>
          ))}
        </p>

        <div className="hero__arch" data-intro>
          <div className="hero__arch-bg" aria-hidden="true">
            <div className="hero__glow" />
            {scene && <HeroScene />}
          </div>
          <span className="hero__floor" aria-hidden="true" />
          <picture>
            <source media="(max-width: 640px)" srcSet={portrait.sm.src} type="image/webp" />
            <img
              className="hero__portrait"
              data-intro
              src={portrait.hd.src}
              width={portrait.hd.width}
              height={portrait.hd.height}
              alt={`Portrait of ${profile.name}`}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>

        {PILLS.map((p) => (
          <div className={`pill-wrap ${p.cls}`} key={p.text} aria-hidden="true">
            <span className="pill" data-intro>
              {p.text}
            </span>
          </div>
        ))}
      </div>

      <div className="hero__bottom container">
        <div className="hero__copy">
          <p className="hero__hey" data-intro>
            Hey, I&rsquo;m {profile.firstName}.
          </p>
          <h1 id="hero-title" className="hero__title">
            <span className="hero__title-line" data-intro>
              {profile.role}
            </span>
            <span className="hero__title-line hero__title-line--soft" data-intro>
              {profile.focus}
            </span>
          </h1>
          <p className="hero__intro" data-intro>
            {profile.intro}
          </p>
          <div className="hero__ctas" data-intro>
            <Button href="#mind-circuit">See the flagship</Button>
            <Button href="#contact" variant="light">
              Get in touch
            </Button>
          </div>
        </div>

        <ul className="hero__stats" aria-label="At a glance">
          {heroStats.map((s) => (
            <li className="hero__stat" key={s.label} data-intro>
              <span className="hero__stat-label">{s.label}</span>
              <span className="hero__stat-value">{s.value}</span>
            </li>
          ))}
        </ul>
      </div>

      <a className="hero__cue" href="#about" data-intro>
        <span>Scroll</span>
        <span className="hero__cue-line" aria-hidden="true" />
      </a>
    </section>
  );
}
