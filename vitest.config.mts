import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const resolvePath = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": resolvePath("./"),
      // `server-only` ships a client build that throws on import; outside the
      // Next bundler we just want it to be a no-op.
      "server-only": resolvePath("./test/server-only.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["{lib,app,components}/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["lib/**/*.ts", "app/api/**/*.ts"],
      exclude: ["lib/**/*.test.ts"],
      thresholds: {
        statements: 70,
        branches: 75,
        functions: 65,
        lines: 70,
      },
    },
  },
});
