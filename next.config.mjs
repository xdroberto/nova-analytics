/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server bundle for the Docker runtime (CI builds, VPS only runs).
  output: "standalone",
  // Pin the project root: a stray lockfile in the user home otherwise makes
  // Next infer the wrong workspace root (breaks file tracing / dev warning).
  outputFileTracingRoot: import.meta.dirname,
  turbopack: {
    root: import.meta.dirname,
  },
  reactCompiler: true,
  compiler: {
    // Keep console.error in prod (server-side error visibility — incl. the pg pool
    // idle-error handler in src/lib/db.ts); strip the noisier console.* levels.
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/default",
        permanent: false,
      },
    ];
  },
  async headers() {
    // Baseline security headers on every response. HSTS omits `preload` on
    // purpose — nova.robertobh.dev is one subdomain of a shared parent; we don't
    // want a preload-list submission affecting sibling sites.
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
