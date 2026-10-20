"use client";

import { useEffect } from "react";
import { nnMarkup } from "./markup";

const BASE = "/sites/nesilnoble/";
const SCRIPTS = ["vendor/gsap.min.js", "vendor/ScrollTrigger.min.js", "vendor/lenis.js", "journey.js"];

type LenisLike = { destroy: () => void };
type NnWindow = Window & { __nnLoaded?: boolean; __lenis?: LenisLike; ScrollTrigger?: { getAll: () => { kill: () => void }[] } };

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = BASE + src;
    el.async = false;
    el.dataset.nn = "1";
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`failed to load ${src}`));
    document.body.appendChild(el);
  });
}

export function NesilNobleJourney() {
  useEffect(() => {
    const w = window as NnWindow;
    let cancelled = false;
    (async () => {
      for (const s of SCRIPTS) {
        if (cancelled) return;
        if (s === "journey.js" && w.__nnLoaded) return;
        await loadScript(s);
      }
      w.__nnLoaded = true;
    })().catch(() => {
      document.querySelector(".nn")?.classList.add("rm");
    });
    return () => {
      cancelled = true;
      w.ScrollTrigger?.getAll().forEach((t) => t.kill());
      w.__lenis?.destroy();
      document.querySelectorAll("script[data-nn]").forEach((n) => n.remove());
      w.__nnLoaded = false;
    };
  }, []);

  return <div className="nn" dangerouslySetInnerHTML={{ __html: nnMarkup }} />;
}
