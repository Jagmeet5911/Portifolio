"use client";

import { useState } from "react";
import { mindCircuit, profile } from "@/data/site";
import { ArrowIcon, Button } from "./ui";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  const tiles = [
    { href: `mailto:${profile.email}`, label: "Email", value: profile.email, external: false },
    { href: profile.linkedin, label: "LinkedIn", value: "jagmeet-singh5911", external: true },
    { href: profile.resume, label: "Résumé", value: "Download PDF", external: false, download: true },
    { href: mindCircuit.url, label: "Flagship", value: "mindcircuit.org", external: true },
  ];

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="contact__panel" data-spotlight>
          <div className="contact__glow" aria-hidden="true" />
          <aside className="contact__now" data-reveal aria-label="Currently">
            <span className="contact__now-dot" aria-hidden="true" />
            <p className="contact__now-label">Currently</p>
            <p className="contact__now-title">Lead engineer, Mind Circuit</p>
            <p className="contact__now-sub">AI Engineer at 1GEN · {profile.location}</p>
          </aside>
          <p className="contact__kicker" data-reveal>
            For recruiters, founders and teams shipping real products
          </p>
          <h2 id="contact-title" className="contact__title" data-split>
            Have something that needs to ship — and keep working?
          </h2>
          <p className="contact__lede" data-reveal>
            I&rsquo;m open to conversations about AI engineering, agent systems and full-stack platform work. The fastest way to
            reach me is email.
          </p>
          <div className="contact__actions" data-reveal>
            <Button href={`mailto:${profile.email}?subject=Hello%20Jagmeet`}>Write to me</Button>
            <button type="button" className="btn btn--light" onClick={copy} aria-live="polite">
              <span className="btn__label">{copied ? "Copied to clipboard" : "Copy email"}</span>
              <span className="btn__disc" aria-hidden="true">
                {copied ? (
                  <svg viewBox="0 0 20 20" width="18" height="18">
                    <path d="M4 10.5 8 14.5 16 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 20 20" width="18" height="18">
                    <rect x="6.5" y="6.5" width="9" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M13.5 4.5h-7a2 2 0 0 0-2 2v7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                )}
              </span>
            </button>
          </div>

          <ul className="contact__tiles">
            {tiles.map((t) => (
              <li key={t.label} data-reveal>
                <a
                  data-spotlight
                  className="tile"
                  href={t.href}
                  {...(t.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  {...(t.download ? { download: "Jagmeet_Singh_Resume.pdf" } : {})}
                >
                  <span className="tile__label">{t.label}</span>
                  <span className="tile__value">{t.value}</span>
                  <span className="tile__arrow" aria-hidden="true">
                    <ArrowIcon diagonal={t.external} />
                  </span>
                  {t.external && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <footer className="footer">
          <p>
            Designed &amp; built by {profile.name} · {profile.location}
          </p>
          <p className="footer__note">Next.js · GSAP · three.js — served from a Docker container.</p>
          <a href="#top" className="footer__top">
            Back to top
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" style={{ transform: "rotate(-90deg)" }}>
              <path d="M4 10h11M11 5.5 15.5 10 11 14.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </a>
        </footer>
      </div>
    </section>
  );
}
