"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { certifications, journey } from "@/data/site";
import { Label } from "./ui";

export default function Journey() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(
          ".journey__rail-fill",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".journey__list", start: "top 70%", end: "bottom 60%", scrub: true } },
        );
        gsap.utils.toArray<HTMLElement>(".journey__item").forEach((el) => {
          gsap.from(el, { autoAlpha: 0, x: 24, duration: 0.8, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
          // Dot fills once the rail has passed it.
          ScrollTrigger.create({ trigger: el, start: "top 62%", toggleClass: { targets: el, className: "is-past" } });
        });
      });
    },
    { scope: root },
  );

  return (
    <section className="journey section" id="journey" ref={root} aria-labelledby="journey-title">
      <div className="container journey__grid">
        <div className="journey__intro">
          <Label>Journey</Label>
          <h2 id="journey-title" className="h2" data-split>
            From SQL dashboards
            <br /> to production agents
          </h2>
          <ul className="journey__certs" data-reveal>
            {certifications.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
        <div className="journey__list">
          <span className="journey__rail" aria-hidden="true">
            <span className="journey__rail-fill" />
          </span>
          <ol>
          {journey.map((j) => (
            <li className="journey__item" key={j.when + j.title}>
              <span className="journey__when">{j.when}</span>
              <span className="journey__title">{j.title}</span>
              <span className="journey__where">{j.where}</span>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
