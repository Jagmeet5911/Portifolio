# syntax=docker/dockerfile:1

# ---- build: static export with Next.js ----
FROM node:22-alpine AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY next.config.ts tsconfig.json ./
COPY src ./src
COPY public ./public

# Absolute site URL for canonical, Open Graph and sitemap links. Public, not a secret.
ARG NEXT_PUBLIC_SITE_URL=https://example.com
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
RUN npm run build

# ---- runtime: unprivileged nginx serving ./out ----
FROM nginxinc/nginx-unprivileged:1.29-alpine AS runtime
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build --chown=101:101 /app/out /usr/share/nginx/html

USER 101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
