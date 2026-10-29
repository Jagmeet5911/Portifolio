"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { faq, profile } from "@/data/site";
import { Button, Label } from "./ui";

export default function Faq() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(".faq__item", {
          x: 60,
          autoAlpha: 0,
          rotate: 1.5,
          stagger: 0.09,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".faq", start: "top 80%", once: true },
        });
        gsap.from(".faq-intro", {
          clipPath: "inset(30% 30% 30% 30% round 40px)",
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: ".faq-intro", start: "top 85%", once: true },
        });
      });
    },
    { scope: root },
  );

  // Fade the newly opened answer's text up; height is handled in CSS.
  const toggle = (i: number) => {
    const next = open === i ? -1 : i;
    setOpen(next);
    if (next < 0 || window.matchMedia(MQ.reduced).matches) return;
    requestAnimationFrame(() => {
      const el = root.current?.querySelector(`#faq-${next} .faq__a-inner`);
      if (el) gsap.fromTo(el.children, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.6, ease: "power3.out" });
    });
  };

  return (
    <section className="decisions section" id="questions" ref={root} aria-labelledby="faq-title">
      <div className="container decisions__grid">
        <div className="decisions__intro faq-intro">
          <div className="faq-intro__orb" aria-hidden="true" />
          <Label>Before you reach out</Label>
          <h2 id="faq-title" className="h2">
            Questions you
            <br /> might have
          </h2>
          <p className="muted">Straight answers to what recruiters and founders usually ask me first.</p>
          <Button href={`mailto:${profile.email}`}>Ask me directly</Button>
        </div>
        <ul className="faq">
          {faq.map((d, i) => {
            const isOpen = open === i;
            return (
              <li key={d.q} className={`faq__item card${isOpen ? " is-open" : ""}`}>
                <h3>
                  <button
                    type="button"
                    className="faq__q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    id={`faq-q-${i}`}
                    onClick={() => toggle(i)}
                  >
                    <span className="faq__n">{String(i + 1).padStart(2, "0")}</span>
                    <span className="faq__text">{d.q}</span>
                    <span className="faq__icon" aria-hidden="true" />
                  </button>
                </h3>
                <div className="faq__a" id={`faq-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
                  <div className="faq__a-inner">
                    <p>{d.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
