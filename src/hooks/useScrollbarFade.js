import { useEffect } from "react";

/**
 * useScrollbarFade — makes the scrollbar disappear when nothing is
 * being scrolled (see the scrollbar rules in src/styles/tailwind.css).
 *
 * How it works: the class `sb-idle` on <html> renders every scrollbar
 * thumb transparent. This hook adds it after `idleMs` without any scroll
 * activity, and removes it the moment scrolling starts. The listener is
 * capture-phase on the document, so scrolling any inner container (the
 * mobile menu, admin tables) wakes the scrollbar too, not just the page.
 *
 * Keyboard scrolling, wheel, touch, and programmatic scrolls all fire
 * scroll events, so every form of interaction brings the bar back.
 */
export default function useScrollbarFade(idleMs = 900) {
  useEffect(() => {
    const root = document.documentElement;
    let timer;

    const goIdle = () => root.classList.add("sb-idle");
    const wake = () => {
      root.classList.remove("sb-idle");
      clearTimeout(timer);
      timer = setTimeout(goIdle, idleMs);
    };

    // Fade shortly after load too — no interaction means no scrollbar.
    wake();

    document.addEventListener("scroll", wake, {
      passive: true,
      capture: true,
    });

    return () => {
      clearTimeout(timer);
      document.removeEventListener("scroll", wake, { capture: true });
      root.classList.remove("sb-idle");
    };
  }, [idleMs]);
}
