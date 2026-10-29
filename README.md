# Jagmeet Singh — Portfolio

A scroll-driven personal portfolio built with Next.js (static export), GSAP + ScrollTrigger, Lenis smooth scrolling, canvas particle morphs and a lazy-loaded three.js hero scene. Served in production by unprivileged nginx in Docker.

## Quick start (Docker)

```bash
cp .env.example .env      # set SITE_URL and PORT
docker compose up --build -d
```

Open `http://localhost:8080` (or whatever `PORT` you set). The container reports healthy once nginx answers `/healthz`.

```bash
docker compose ps         # STATUS should read (healthy)
docker compose logs -f
docker compose down
```

`SITE_URL` is baked into canonical, Open Graph and sitemap links at build time, so rebuild after changing it.

## Local development

Node 22+.

```bash
npm install
npm run dev               # http://localhost:3100
npm run build             # static export into ./out
npm run lint              # TypeScript check
```

`npm start` serves `./out` locally after a build.

## Project layout

```
src/
  app/            layout (metadata, fonts, JSON-LD), page, 404, robots, sitemap, globals.css (design system)
  components/     one file per section; mc/ holds the Mind Circuit chapter
  data/site.ts    every fact, number and link on the site — edit content here
  lib/gsap.ts     plugin registration and shared media queries
public/           optimized images, Open Graph card, résumé PDF
assets-src/       source portrait; `npm run assets` regenerates public/images and og.png
scripts/          build-assets.mjs (sharp) and cutout.swift (macOS Vision background removal)
docker/nginx.conf static serving, caching, security headers, /healthz
```

### Portrait pipeline

The source photo is 640×640. It was upscaled 4× locally with Real-ESRGAN (`realesrgan-x4plus`, ncnn build), cut out with macOS Vision using its full mask (no erosion, so thin profile details like lips survive), then cleaned by `refine-matte.mjs`: edge colours are decontaminated (no background halo) and the stair-stepped mask contour is smoothed. It's exported as WebP at native width, with no further upscaling, under content-hashed filenames (`src/data/assets.ts` is generated) so browsers never show a stale cached portrait.

```bash
realesrgan-ncnn-vulkan -i photo.jpg -o photo-x4.png -n realesrgan-x4plus -s 4
swiftc -O scripts/cutout.swift -o /tmp/cutout && /tmp/cutout photo-x4.png assets-src/portrait-raw.png
node scripts/refine-matte.mjs assets-src/portrait-raw.png assets-src/portrait-cutout.png
npm run assets
```

A higher-resolution original photo will always beat the AI upscale — drop it in and rerun from the cut-out step.

### Motion conventions

Markup opts into page-wide patterns handled by `components/Motion.tsx`: `data-reveal`, `data-split`, `data-scrub-words`, `data-count`, `data-draw`, `data-magnetic`. `components/fx/ParticleField.ts` drives the scroll-scrubbed particle morphs (About's signature-build icons from `fx/icons.ts`, the Mind Circuit mark). `Experience.tsx` adds Lenis, the progress bar and the pointer follower. The Mind Circuit beats rail only pins at ≥1024px; on phones it is a native swipe. Everything runs inside `gsap.matchMedia`, so `prefers-reduced-motion: reduce` gets a static, fully visible page. The three.js scene loads only when WebGL is available and motion is allowed, and pauses off screen.

## Content rules

All claims come from the résumé, git history and source code of the repositories, and are confirmed by Jagmeet. The little chat and card animations in the Mind Circuit beats are illustrations with fictional content. The architecture sketches are simplified drawings of real systems. Private repositories are never linked.

## Deploying to a VPS / EC2

1. Install Docker Engine with the Compose plugin.
2. Copy the repository to the server and create `.env` with your real `SITE_URL` (for example `https://jagmeet.dev`). Keep `PORT=8080`, or pick any free port.
3. `docker compose up --build -d`.
4. Put HTTPS in front of it. The simplest option is [Caddy](https://caddyserver.com), which gets certificates automatically:

   ```caddyfile
   # /etc/caddy/Caddyfile
   jagmeet.dev, www.jagmeet.dev {
       encode zstd gzip
       reverse_proxy 127.0.0.1:8080
   }
   ```

   Then run `sudo systemctl reload caddy`. Point the domain's A/AAAA records at the server and open ports 80/443 (on EC2, in the security group). Keep 8080 closed to the internet. If you bind the container to localhost only, change the compose port to `"127.0.0.1:${PORT:-8080}:8080"`.

   With nginx on the host instead, use `proxy_pass http://127.0.0.1:8080;` inside a TLS server block issued by certbot.

### Hardening already in place

- Multi-stage build; the runtime image holds only nginx and static files (~86 MB).
- Runs as uid 101 with a read-only root filesystem, `/tmp` on tmpfs, all capabilities dropped and `no-new-privileges`.
- CSP, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy` and `Permissions-Policy` headers.
- Hashed assets cached for a year; HTML revalidated on every request.
- No secrets anywhere: the site has no backend and needs no credentials.
