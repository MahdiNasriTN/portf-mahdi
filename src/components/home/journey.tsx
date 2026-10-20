"use client";

import { useEffect } from "react";
import { siteMarkup } from "./markup";

const BASE = "/home/";
const SCRIPTS = ["vendor/gsap.min.js", "vendor/ScrollTrigger.min.js", "vendor/lenis.js", "journey.js"];

type LenisLike = { destroy: () => void };
type SiteWindow = Window & { __siteLoaded?: boolean; __lenis?: LenisLike; ScrollTrigger?: { getAll: () => { kill: () => void }[] } };

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = BASE + src;
    el.async = false;
    el.dataset.site = "1";
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`failed to load ${src}`));
    document.body.appendChild(el);
  });
}

export function HomeJourney() {
  useEffect(() => {
    const w = window as SiteWindow;
    let cancelled = false;
    (async () => {
      for (const s of SCRIPTS) {
        if (cancelled) return;
        if (s === "journey.js" && w.__siteLoaded) return;
        await loadScript(s);
      }
      w.__siteLoaded = true;
    })().catch(() => {
      document.querySelector(".mn")?.classList.add("rm");
    });
    return () => {
      cancelled = true;
      w.ScrollTrigger?.getAll().forEach((t) => t.kill());
      w.__lenis?.destroy();
      document.querySelectorAll("script[data-site]").forEach((n) => n.remove());
      w.__siteLoaded = false;
    };
  }, []);

  return <div className="mn" dangerouslySetInnerHTML={{ __html: siteMarkup }} />;
}
