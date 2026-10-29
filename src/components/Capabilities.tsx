"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { capabilities } from "@/data/site";
import { Chips, Label } from "./ui";

export default function Capabilities() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Cards fold up out of the page as the grid scrolls in — tied to the scroll, not a timer.
        gsap.fromTo(
          ".cap",
          { y: 140, rotateX: -32, scale: 0.92, autoAlpha: 0, transformOrigin: "50% 100%" },
          {
            y: 0,
            rotateX: 0,
            scale: 1,
            autoAlpha: 1,
            ease: "power2.out",
            stagger: { amount: 0.6, grid: "auto", from: "start" },
            scrollTrigger: { trigger: ".caps__grid", start: "top 92%", end: "top 30%", scrub: 1 },
          },
        );
        gsap.utils.toArray<HTMLElement>(".cap").forEach((card) => {
          gsap.from(card.querySelectorAll(".chips li"), {
            y: 14,
            autoAlpha: 0,
            stagger: 0.05,
            duration: 0.6,
            ease: "back.out(2)",
            scrollTrigger: { trigger: card, start: "top 70%", once: true },
          });
        });
        // Accent orbs drift with the scroll.
        gsap.to(".cap__orb", {
          yPercent: -60,
          xPercent: 20,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section className="caps section" id="capabilities" ref={root} aria-labelledby="caps-title">
      <div className="container">
        <div className="section-head">
          <Label>Capabilities</Label>
          <h2 id="caps-title" className="h2" data-split>
            What I&rsquo;m trusted with,
            <br /> and where it shipped
          </h2>
        </div>
        <ul className="caps__grid">
          {capabilities.map((c, i) => (
            <li key={c.title} className={`cap card cap--${c.size}${i < 2 ? " cap--accent" : ""}`} data-spotlight>
              {i < 2 && <span className="cap__orb" aria-hidden="true" />}
              <span className="cap__n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="cap__title">{c.title}</h3>
              <p className="cap__body">{c.body}</p>
              <Chips items={c.tags} />
              <p className="cap__proof">
                <span>Shipped in</span> {c.proof}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
