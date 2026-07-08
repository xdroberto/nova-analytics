"use client";

import { useEffect } from "react";

/**
 * Reloads the page when it is restored from the browser's back/forward cache
 * (bfcache). Dashboard pages are dynamically rendered, and Next controls the
 * Cache-Control of dynamic routes (it serves `no-cache`, not `no-store`), so
 * neither `next.config` headers nor the edge proxy can reliably mark them
 * `no-store` — the only directive that disables bfcache. Without this, after
 * logout the Back button restores a stale authenticated view from bfcache.
 *
 * On a bfcache restore (`pageshow` with `persisted === true`), the reload
 * re-hits the server auth check, which redirects a logged-out visitor to /login.
 */
export function BfcacheGuard() {
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  return null;
}
