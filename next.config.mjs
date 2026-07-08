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
    removeConsole: process.env.NODE_ENV === "production",
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
};

export default nextConfig;
