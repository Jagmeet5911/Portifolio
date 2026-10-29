"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { mcBeats, mindCircuit } from "@/data/site";
import { ParticleField } from "./fx/ParticleField";
import { beatVisuals } from "./mc/BeatVisuals";
import { ArrowIcon, Button, Label } from "./ui";

const TITLE = "Mind Circuit";

export default function MindCircuit() {
  const root = useRef<HTMLElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const field = useRef<ParticleField | null>(null);
  const rail = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const small = window.innerWidth < 768;
    const f = new ParticleField(c, [{ kind: "cloud" }, { kind: "image", src: "/brand/mind-circuit-mark.png" }], {
      count: small ? 1300 : 2600,
      colors: ["#0d5c3a", "#1f7a50", "#2f9e6a", "#6fcf97", "#b8ecc9"],
      font: "Geist, sans-serif",
      fill: 0.84,
      size: small ? [0.9, 1.8] : [1, 2.2],
    });
    field.current = f;
    let alive = true;
    f.init().then(() => {
      if (!alive) return;
      // Reduced motion shows the finished mark.
      if (window.matchMedia(MQ.reduced).matches) f.morph(1, 1, 0);
      f.start();
    });
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? f.start() : f.stop()));
    io.observe(c);
    const ro = new ResizeObserver(() => f.resize());
    ro.observe(c);
    const move = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      f.pointer(e.clientX - r.left, e.clientY - r.top);
    };
    const leave = () => f.pointer(-9999, -9999);
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerleave", leave);
    return () => {
      alive = false;
      io.disconnect();
      ro.disconnect();
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerleave", leave);
      f.destroy();
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        // 1. Intro: the swarm gathers into the mark while the name rises letter by letter.
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: intro.current,
            start: "top top",
            end: () => `+=${window.innerHeight * 1.6}`,
            pin: true,
            scrub: 0.8,
          },
        });
        const prog = { t: 0 };
        tl.to(prog, { t: 1, duration: 1, ease: "none", onUpdate: () => field.current?.morph(0, 1, prog.t) }, 0)
          .fromTo(".mc-intro__char", { yPercent: 120, rotate: 8 }, { yPercent: 0, rotate: 0, stagger: 0.04, duration: 0.5 }, 0.3)
          .fromTo(".mc-intro__fade", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.35 }, 0.7)
          .fromTo(".mc-intro__badges li", { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, stagger: 0.06, duration: 0.3, ease: "back.out(2)" }, 0.85)
          .to({}, { duration: 0.25 });
      });

      mm.add(MQ.desktopMotion, () => {
        // 2. Beats: the rail slides sideways while pinned; each card tilts in as it arrives.
        const track = rail.current!;
        const dist = () => track.scrollWidth - window.innerWidth + 80;
        const slide = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: ".mc-beats",
            start: "top top",
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        gsap.to(".mc-beats__bar span", {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: ".mc-beats", start: "top top", end: () => `+=${dist()}`, scrub: true },
        });
        gsap.utils.toArray<HTMLElement>(".beat").forEach((card) => {
          gsap.fromTo(
            card,
            { rotateY: -18, scale: 0.86, autoAlpha: 0.35 },
            {
              rotateY: 0,
              scale: 1,
              autoAlpha: 1,
              ease: "power2.out",
              scrollTrigger: { trigger: card, containerAnimation: slide, start: "left 95%", end: "left 45%", scrub: true },
            },
          );
          ScrollTrigger.create({
            trigger: card,
            containerAnimation: slide,
            start: "left 70%",
            end: "right 30%",
            toggleClass: { targets: card, className: "is-live" },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section className="mc" id="mind-circuit" ref={root} aria-labelledby="mc-title">
      <div className="mc-intro" ref={intro}>
        <div className="mc-intro__glow" aria-hidden="true" />
        <div className="mc-intro__inner container">
          <div className="mc-intro__visual">
            <canvas ref={canvas} className="mc-intro__canvas" aria-hidden="true" />
          </div>
          <div className="mc-intro__text">
            <div className="mc-intro__fade">
              <Label tone="mc">Featured project · 01</Label>
            </div>
            <h2 id="mc-title" className="mc-intro__title" aria-label={TITLE}>
              {TITLE.split(" ").map((word, w) => (
                <span className="mc-intro__word" key={w} aria-hidden="true">
                  {word.split("").map((ch, i) => (
                    <span className="mc-intro__mask" key={i}>
                      <span className="mc-intro__char">{ch}</span>
                    </span>
                  ))}
                </span>
              ))}
            </h2>
            <p className="mc-intro__tagline mc-intro__fade">{mindCircuit.tagline}</p>
            <ul className="mc-intro__badges" aria-label="Project status">
              {mindCircuit.badges.map((b, i) => (
                <li key={b} className={i === 0 ? "is-live" : undefined}>
                  {b}
                </li>
              ))}
            </ul>
            <p className="mc-intro__role mc-intro__fade">{mindCircuit.role}</p>
          </div>
        </div>
      </div>

      <div className="mc-beats">
        <div className="mc-beats__head container">
          <p className="eyebrow">What I built</p>
          <p className="mc-beats__bar" aria-hidden="true">
            <span />
          </p>
        </div>
        <div className="mc-beats__viewport">
          <div className="mc-beats__rail" ref={rail}>
            {mcBeats.map((b, i) => {
              const Visual = beatVisuals[b.id as keyof typeof beatVisuals];
              return (
                <article className="beat" key={b.id}>
                  <Visual />
                  <div className="beat__text">
                    <p className="beat__kicker">
                      <span>{String(i + 1).padStart(2, "0")}</span> {b.kicker}
                    </p>
                    <h3 className="beat__title">{b.title}</h3>
                    <p className="beat__body">{b.body}</p>
                  </div>
                </article>
              );
            })}
            <article className="beat beat--cta">
              <img src="/brand/mind-circuit-mark.png" alt="" width={64} height={69} />
              <h3 className="beat__title">Live for US classrooms.</h3>
              <p className="beat__body">See the product in the wild.</p>
              <Button href={mindCircuit.url} external>
                mindcircuit.org
              </Button>
              <a className="beat__more" href="#work">
                Next: more work <ArrowIcon />
              </a>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
