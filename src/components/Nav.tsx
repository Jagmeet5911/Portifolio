"use client";

import { useEffect, useRef, useState } from "react";
import { nav, profile } from "@/data/site";
import { ArrowIcon } from "./ui";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Hide while reading downward, return on any upward scroll.
      setHidden(y > 480 && y > last.current + 4);
      if (y < last.current - 4 || y < 480) setHidden(false);
      last.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}${hidden && !open ? " is-hidden" : ""}${open ? " is-open" : ""}`}>
      <div className="nav__bar">
        <a className="nav__brand" href="#top" aria-label={`${profile.name}, back to top`}>
          <span className="nav__mark" aria-hidden="true">
            <svg viewBox="0 0 64 64" width="18" height="18">
              <path d="M14 52V30a18 18 0 0 1 36 0v22" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
              <circle cx="32" cy="30" r="6" fill="currentColor" />
            </svg>
          </span>
          <span>{profile.name}</span>
        </a>
        <nav aria-label="Primary" className="nav__links">
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href}>{n.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav__actions">
          <a className="btn btn--dark btn--sm" href="#contact">
            <span className="btn__label">Get in touch</span>
            <span className="btn__disc">
              <ArrowIcon />
            </span>
          </a>
          <button
            className="nav__toggle"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className="nav__burger" />
          </button>
        </div>
      </div>
      <nav id="mobile-menu" aria-label="Mobile" className="nav__sheet" hidden={!open}>
        <ul>
          {[...nav, { href: "#contact", label: "Contact" }].map((n) => (
            <li key={n.href}>
              <a href={n.href} onClick={() => setOpen(false)}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
