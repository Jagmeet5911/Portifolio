"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { moreWork, projects } from "@/data/site";
import { Button, Chips, Label } from "./ui";
import { diagrams } from "./Diagrams";

export default function Work() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap.utils.toArray<HTMLElement>(".project").forEach((card) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 78%", once: true } });
          tl.from(card, { y: 120, rotateX: 14, autoAlpha: 0, transformOrigin: "50% 0%", duration: 1.2, ease: "expo.out" })
            .from(card.querySelector(".project__index"), { xPercent: 60, autoAlpha: 0, duration: 1, ease: "expo.out" }, 0.2)
            .from(card.querySelectorAll(".project__meta > *, .project__summary, .project__points li"), { y: 26, autoAlpha: 0, stagger: 0.07, duration: 0.8 }, 0.3)
            .from(card.querySelectorAll(".chips li"), { scale: 0.6, autoAlpha: 0, stagger: 0.03, duration: 0.5, ease: "back.out(2)" }, 0.6)
            .from(card.querySelector(".project__visual"), { scale: 0.9, autoAlpha: 0, rotate: -2, duration: 1.1, ease: "expo.out" }, 0.25);
        });

        gsap.from(".more__item", {
          y: 90,
          rotateX: -25,
          rotate: (i: number) => (i % 2 ? 3 : -3),
          autoAlpha: 0,
          transformOrigin: "50% 100%",
          stagger: 0.1,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: ".more", start: "top 85%", once: true },
        });
      });

      // Sticky stack: each case study recedes as the next one slides over it.
      mm.add(MQ.desktopMotion, () => {
        const cards = gsap.utils.toArray<HTMLElement>(".project");
        cards.slice(0, -1).forEach((card, i) => {
          gsap.to(card, {
            scale: 0.92 + i * 0.02,
            yPercent: -2,
            ease: "none",
            scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 140px", scrub: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section className="work section" id="work" ref={root} aria-labelledby="work-title">
      <div className="container">
        <div className="section-head">
          <Label>Selected work · built at 1GEN</Label>
          <h2 id="work-title" className="h2" data-split>
            Agents, security and
            <br /> systems that heal
          </h2>
          <p className="section-head__note" data-reveal>
            These codebases are private. Each case is shown as an architecture sketch drawn from the repository — no source, no
            internal data.
          </p>
        </div>

        <ol className="projects">
          {projects.map((p, i) => {
            const Diagram = diagrams[p.diagram];
            return (
              <li className="project card" key={p.id} id={`work-${p.id}`} data-spotlight>
                <div className="project__top">
                  <h3 className="project__name">{p.name}</h3>
                  <span className="project__index" aria-hidden="true">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                </div>
                <div className="project__grid">
                  <div className="project__text">
                    <p className="project__meta">
                      <span className="status">{p.status}</span>
                      <span>{p.kind}</span>
                      <span>{p.period}</span>
                    </p>
                    <p className="project__summary">{p.summary}</p>
                    <ul className="project__points">
                      {p.points.map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                    <Chips items={p.stack} />
                    {p.link && (
                      <div className="project__link">
                        <Button href={p.link.href} external>
                          {p.link.label}
                        </Button>
                      </div>
                    )}
                  </div>
                  <figure className="project__visual" tabIndex={0} aria-label={`${p.name} architecture sketch`}>
                    <Diagram />
                    <figcaption>Architecture sketch · simplified</figcaption>
                  </figure>
                </div>
              </li>
            );
          })}
        </ol>

        <h3 className="more__title" data-split>
          Also delivered
        </h3>
        <ul className="more">
          {moreWork.map((m) => (
            <li className="card more__item" key={m.name} data-spotlight>
              <p className="project__meta">
                <span className="status">{m.status}</span>
                <span>{m.period}</span>
              </p>
              <h4 className="more__name">{m.name}</h4>
              <p className="more__body">{m.body}</p>
              <Chips items={m.stack} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
