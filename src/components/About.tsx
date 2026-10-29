"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { profile, signature } from "@/data/site";
import { ParticleField } from "./fx/ParticleField";
import { icons } from "./fx/icons";
import { Label } from "./ui";

export default function About() {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const field = useRef<ParticleField | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const small = window.innerWidth < 768;
    const f = new ParticleField(
      c,
      signature.map((s) => ({ kind: "image" as const, src: icons[s.icon] })),
      {
        count: small ? 1300 : 2400,
        colors: ["#3348ff", "#5d70ff", "#8d9bff", "#0d1015"],
        font: "Geist, ui-sans-serif, system-ui, sans-serif",
        fill: 0.78,
        size: small ? [0.9, 1.9] : [1.1, 2.3],
      },
    );
    field.current = f;
    let alive = true;
    f.init().then(() => alive && f.start());

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
      const n = signature.length;
      mm.add(MQ.motion, () => {
        // Pin the stage; scrubbing drags the swarm from one build's icon to the next.
        ScrollTrigger.create({
          trigger: stage.current,
          start: "center center",
          end: () => `+=${window.innerHeight * (n - 1) * 0.9}`,
          pin: true,
          scrub: true,
          snap: { snapTo: 1 / (n - 1), duration: { min: 0.3, max: 0.8 }, delay: 0.05, ease: "power2.inOut" },
          onUpdate: (self) => {
            const pos = self.progress * (n - 1);
            const a = Math.min(n - 2, Math.floor(pos));
            field.current?.morph(a, a + 1, pos - a);
            setActive(Math.round(pos));
          },
        });
        gsap.from(".proof__panel", {
          clipPath: "inset(12% 8% 12% 8% round 40px)",
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: stage.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: stage },
  );

  const current = signature[active];

  return (
    <section className="about section" id="about" aria-labelledby="about-title">
      <div className="container about__grid">
        <Label>About me</Label>
        <div className="about__main">
          <h2 id="about-title" className="about__statement" data-scrub-words>
            {profile.statement}
          </h2>
          <p className="about__lede" data-reveal>
            I joined 1GEN in January 2025 as a data scientist and moved into backend, agents and deployment. Since then I&rsquo;ve
            delivered across eight products — from an NGO suite and a lending app to an HR agent, an aviation platform and, now,
            Mind Circuit for a US client.
          </p>
        </div>
      </div>

      <div className="proof container" ref={stage}>
        <div className="proof__panel">
          <div className="proof__aurora" aria-hidden="true" />
          <div className="proof__text" aria-live="polite">
            <p className="proof__kicker">
              <span>{String(active + 1).padStart(2, "0")}</span> / {String(signature.length).padStart(2, "0")} · Signature builds
            </p>
            <p className="proof__project" key={`k${active}`}>
              {current.kicker}
            </p>
            <h3 className="proof__label" key={`t${active}`}>
              {current.title}
            </h3>
            <p className="proof__detail" key={`b${active}`}>
              {current.body}
            </p>
            <ol className="proof__dots">
              {signature.map((s, i) => (
                <li key={s.title}>
                  <button
                    type="button"
                    className={i === active ? "is-on" : undefined}
                    aria-label={`Show ${s.title}`}
                    aria-pressed={i === active}
                    onClick={() => {
                      setActive(i);
                      field.current?.morph(i, i, 0);
                    }}
                  />
                </li>
              ))}
            </ol>
          </div>
          <div className="proof__visual" aria-hidden="true">
            <canvas ref={canvas} className="proof__canvas" />
          </div>
        </div>
        {/* All builds as plain text for screen readers and no-JS. */}
        <ul className="sr-only">
          {signature.map((s) => (
            <li key={s.title}>
              {s.title} ({s.kicker}): {s.body}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
