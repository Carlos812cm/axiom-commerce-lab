import path from "node:path";
import { fileURLToPath } from "node:url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const repoRoot = path.resolve(dirname, "../..");

/** @type {import("next").NextConfig} */
const nextConfig = {
  transpilePackages: ["@axiom/ui", "@axiom/db"],
  turbopack: {
    root: repoRoot
  }
};

export default nextConfig;
