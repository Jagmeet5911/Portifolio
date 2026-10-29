import type { ReactNode } from "react";

export function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" style={diagonal ? { transform: "rotate(-45deg)" } : undefined}>
      <path d="M4 10h11M11 5.5 15.5 10 11 14.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "dark" | "light";
  external?: boolean;
  download?: boolean;
  diagonal?: boolean;
};

/** Pill button with a detached arrow disc, after the reference's CTA. */
export function Button({ href, children, variant = "dark", external, download, diagonal }: ButtonProps) {
  return (
    <a
      className={`btn btn--${variant}`}
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: "" } : {})}
      data-magnetic
    >
      <span className="btn__label">{children}</span>
      <span className="btn__disc">
        <ArrowIcon diagonal={diagonal || external} />
      </span>
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

export function Label({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "mc" }) {
  return (
    <p className={`label label--${tone}`}>
      <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
        <path d="M8 1v14M1 8h14M3 3l10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {children}
    </p>
  );
}

export function Chips({ items, tone }: { items: readonly string[]; tone?: "mc" | "cobalt" }) {
  return (
    <ul className={`chips${tone ? ` chips--${tone}` : ""}`}>
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

/** Animated counter target; the Motion component counts it up when it scrolls in. */
export function Count({ value }: { value: string }) {
  return (
    <span className="count" data-count={value}>
      {value}
    </span>
  );
}
