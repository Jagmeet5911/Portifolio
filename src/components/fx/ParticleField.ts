/**
 * Canvas particle field that morphs between shapes.
 *
 * Each target is a set of points sampled from text or an image's alpha. Every
 * particle has a home on each target; `morph(a, b, t)` blends homes between
 * two targets, and particles spring toward that blend with a little curl
 * noise, so scrubbing the scroll position drags the swarm smoothly from one
 * shape to the next. The pointer pushes particles aside.
 */

export type Target = { kind: "text"; value: string; weight?: number } | { kind: "image"; src: string } | { kind: "cloud" };

type Options = {
  count: number;
  colors: string[];
  font: string;
  /** fraction of the canvas the shape may occupy */
  fill?: number;
  size?: [number, number];
};

type P = { x: number; y: number; vx: number; vy: number; hx: number; hy: number; c: number; s: number; seed: number };

export class ParticleField {
  private ctx: CanvasRenderingContext2D;
  private dpr = Math.min(window.devicePixelRatio || 1, 2);
  private w = 0;
  private h = 0;
  private ps: P[] = [];
  private homes: Float32Array[] = [];
  private targets: Target[];
  private images = new Map<string, HTMLImageElement>();
  private raf = 0;
  private running = false;
  private a = 0;
  private b = 0;
  private t = 0;
  private mx = -9999;
  private my = -9999;
  private time = 0;
  private reduced: boolean;

  constructor(private canvas: HTMLCanvasElement, targets: Target[], private opts: Options) {
    this.ctx = canvas.getContext("2d")!;
    this.targets = targets;
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  async init() {
    await Promise.all(
      this.targets.filter((t): t is Extract<Target, { kind: "image" }> => t.kind === "image").map(
        (t) =>
          new Promise<void>((res) => {
            const img = new Image();
            img.onload = () => {
              this.images.set(t.src, img);
              res();
            };
            img.onerror = () => res();
            img.src = t.src;
          }),
      ),
    );
    await document.fonts?.ready;
    this.resize();
  }

  resize() {
    const r = this.canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    this.w = r.width;
    this.h = r.height;
    this.canvas.width = Math.round(r.width * this.dpr);
    this.canvas.height = Math.round(r.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.homes = this.targets.map((t) => this.sample(t));
    if (!this.ps.length) {
      const n = this.opts.count;
      const [smin, smax] = this.opts.size ?? [1.1, 2.4];
      for (let i = 0; i < n; i++) {
        this.ps.push({
          x: Math.random() * this.w,
          y: Math.random() * this.h,
          vx: 0,
          vy: 0,
          hx: 0,
          hy: 0,
          c: Math.floor(Math.random() * this.opts.colors.length),
          s: smin + Math.random() * (smax - smin),
          seed: Math.random() * 1000,
        });
      }
    }
    this.applyHomes();
    if (this.reduced) {
      // No motion: snap to the current shape and draw once.
      for (const p of this.ps) {
        p.x = p.hx;
        p.y = p.hy;
      }
      this.draw();
    }
  }

  /** Blend between target a and b; t in [0,1]. */
  morph(a: number, b: number, t: number) {
    this.a = a;
    this.b = b;
    this.t = t;
    this.applyHomes();
    if (this.reduced) {
      for (const p of this.ps) {
        p.x = p.hx;
        p.y = p.hy;
      }
      this.draw();
    }
  }

  pointer(x: number, y: number) {
    this.mx = x;
    this.my = y;
  }

  start() {
    if (this.running || this.reduced) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      this.step();
      this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.stop();
  }

  private applyHomes() {
    const A = this.homes[this.a];
    const B = this.homes[this.b];
    if (!A || !B) return;
    // Ease the blend and add a mid-flight bulge so morphs swirl instead of sliding.
    const t = this.t < 0.5 ? 4 * this.t ** 3 : 1 - (-2 * this.t + 2) ** 3 / 2;
    const bulge = Math.sin(this.t * Math.PI);
    const cx = this.w / 2;
    const cy = this.h / 2;
    for (let i = 0; i < this.ps.length; i++) {
      const p = this.ps[i];
      const ax = A[i * 2], ay = A[i * 2 + 1], bx = B[i * 2], by = B[i * 2 + 1];
      let x = ax + (bx - ax) * t;
      let y = ay + (by - ay) * t;
      const ang = p.seed + bulge * 2.4;
      const r = bulge * (30 + (p.seed % 1) * 90);
      x += Math.cos(ang) * r + (x - cx) * bulge * 0.15;
      y += Math.sin(ang) * r + (y - cy) * bulge * 0.15;
      p.hx = x;
      p.hy = y;
    }
  }

  private step() {
    this.time += 0.016;
    const R = 90;
    for (const p of this.ps) {
      // Spring home + gentle curl drift.
      const nx = Math.sin(p.seed + this.time * 0.9 + p.hy * 0.012) * 0.35;
      const ny = Math.cos(p.seed * 1.3 + this.time * 0.8 + p.hx * 0.012) * 0.35;
      p.vx += (p.hx - p.x) * 0.045 + nx;
      p.vy += (p.hy - p.y) * 0.045 + ny;
      const dx = p.x - this.mx;
      const dy = p.y - this.my;
      const d2 = dx * dx + dy * dy;
      if (d2 < R * R) {
        const d = Math.sqrt(d2) || 1;
        const f = ((R - d) / R) * 3.2;
        p.vx += (dx / d) * f;
        p.vy += (dy / d) * f;
      }
      p.vx *= 0.82;
      p.vy *= 0.82;
      p.x += p.vx;
      p.y += p.vy;
    }
  }

  private draw() {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.w, this.h);
    const cols = this.opts.colors;
    for (let c = 0; c < cols.length; c++) {
      ctx.fillStyle = cols[c];
      ctx.beginPath();
      for (const p of this.ps) {
        if (p.c !== c) continue;
        ctx.moveTo(p.x + p.s, p.y);
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
      }
      ctx.fill();
    }
  }

  /** Points for one target, one home per particle, in canvas CSS pixels. */
  private sample(t: Target): Float32Array {
    const n = this.opts.count;
    const out = new Float32Array(n * 2);
    if (t.kind === "cloud") {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * Math.max(this.w, this.h) * 0.62;
        out[i * 2] = this.w / 2 + Math.cos(a) * r;
        out[i * 2 + 1] = this.h / 2 + Math.sin(a) * r * 0.7;
      }
      return out;
    }
    const off = document.createElement("canvas");
    const W = Math.max(1, Math.round(this.w));
    const H = Math.max(1, Math.round(this.h));
    off.width = W;
    off.height = H;
    const g = off.getContext("2d", { willReadFrequently: true })!;
    const fill = this.opts.fill ?? 0.8;
    if (t.kind === "text") {
      let size = H * fill;
      g.font = `${t.weight ?? 700} ${size}px ${this.opts.font}`;
      const mw = g.measureText(t.value).width;
      if (mw > W * fill) size *= (W * fill) / mw;
      g.font = `${t.weight ?? 700} ${size}px ${this.opts.font}`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillStyle = "#000";
      g.fillText(t.value, W / 2, H / 2 + size * 0.04);
    } else {
      const img = this.images.get(t.src);
      if (img) {
        const s = Math.min((W * fill) / img.width, (H * fill) / img.height);
        const iw = img.width * s, ih = img.height * s;
        g.drawImage(img, (W - iw) / 2, (H - ih) / 2, iw, ih);
      }
    }
    const data = g.getImageData(0, 0, W, H).data;
    const pts: number[] = [];
    const step = Math.max(2, Math.round(Math.sqrt((W * H) / (n * 6))));
    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        if (data[(y * W + x) * 4 + 3] > 128) pts.push(x, y);
      }
    }
    const m = pts.length / 2;
    if (!m) return this.sample({ kind: "cloud" });
    // Shuffle so particles don't sweep in scanline order, then wrap to n.
    const idx = Array.from({ length: m }, (_, i) => i);
    for (let i = m - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    for (let i = 0; i < n; i++) {
      const k = idx[i % m];
      out[i * 2] = pts[k * 2] + (Math.random() - 0.5) * step * 0.9;
      out[i * 2 + 1] = pts[k * 2 + 1] + (Math.random() - 0.5) * step * 0.9;
    }
    return out;
  }
}
