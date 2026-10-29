import type { Metadata } from "next";
import { Button } from "@/components/ui";

export const metadata: Metadata = { title: "Page not found — Jagmeet Singh", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="notfound">
      <p className="notfound__code" aria-hidden="true">404</p>
      <h1 className="h2">This page didn&rsquo;t ship.</h1>
      <p className="muted">The link may be old, or the address mistyped.</p>
      <Button href="/">Back to the portfolio</Button>
    </main>
  );
}
