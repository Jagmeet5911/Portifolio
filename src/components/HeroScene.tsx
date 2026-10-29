"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A slow-turning constellation behind the portrait — nodes and the links
 * between near neighbours, standing in for agents talking to services.
 * Pauses whenever the hero is off screen or the tab is hidden.
 */
export default function HeroScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
    camera.position.set(0, 0, 7.5);

    // Nodes on a loose shell, seeded so the layout is identical on every visit.
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const COUNT = window.innerWidth < 768 ? 70 : 120;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < COUNT; i++) {
      const u = rand() * 2 - 1;
      const t = rand() * Math.PI * 2;
      const r = 2.2 + rand() * 0.9;
      const s = Math.sqrt(1 - u * u);
      pts.push(new THREE.Vector3(r * s * Math.cos(t), r * u * 1.25, r * s * Math.sin(t)));
    }

    const sprite = (() => {
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const g = c.getContext("2d")!;
      const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grd.addColorStop(0, "rgba(255,255,255,1)");
      grd.addColorStop(0.35, "rgba(255,255,255,0.85)");
      grd.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grd;
      g.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    })();

    const nodeGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const nodes = new THREE.Points(
      nodeGeo,
      new THREE.PointsMaterial({ size: 0.13, map: sprite, transparent: true, depthWrite: false, color: 0xffffff, opacity: 0.95 }),
    );

    const linkPos: number[] = [];
    for (let i = 0; i < pts.length; i++) {
      let links = 0;
      for (let j = i + 1; j < pts.length && links < 3; j++) {
        if (pts[i].distanceTo(pts[j]) < 1.15) {
          linkPos.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
          links++;
        }
      }
    }
    const linkGeo = new THREE.BufferGeometry();
    linkGeo.setAttribute("position", new THREE.Float32BufferAttribute(linkPos, 3));
    const links = new THREE.LineSegments(
      linkGeo,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22, depthWrite: false }),
    );

    // A handful of brighter "active" nodes that pulse.
    const hot = pts.filter((_, i) => i % 11 === 0);
    const hotGeo = new THREE.BufferGeometry().setFromPoints(hot);
    const hotMat = new THREE.PointsMaterial({ size: 0.3, map: sprite, transparent: true, depthWrite: false, color: 0xdfe4ff });
    const hotPts = new THREE.Points(hotGeo, hotMat);

    const group = new THREE.Group();
    group.add(links, nodes, hotPts);
    group.position.y = 0.9;
    scene.add(group);

    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 0.5;
      ty = (e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) loop();
    });
    io.observe(el);

    const start = performance.now();
    let raf = 0;
    const loop = () => {
      if (!visible || document.hidden) {
        raf = 0;
        return;
      }
      const t = (performance.now() - start) / 1000;
      cx += (tx - cx) * 0.04;
      cy += (ty - cy) * 0.04;
      group.rotation.y = t * 0.06 + cx;
      group.rotation.x = 0.15 + cy;
      hotMat.size = 0.24 + Math.sin(t * 1.6) * 0.07;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    const onVis = () => !document.hidden && visible && !raf && loop();
    document.addEventListener("visibilitychange", onVis);
    loop();
    requestAnimationFrame(() => el.classList.add("is-live"));

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      nodeGeo.dispose();
      linkGeo.dispose();
      hotGeo.dispose();
      sprite.dispose();
      (nodes.material as THREE.Material).dispose();
      (links.material as THREE.Material).dispose();
      hotMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={host} className="hero__scene" aria-hidden="true" />;
}
