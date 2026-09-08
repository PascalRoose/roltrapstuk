/**
 * Conventional Commits, enforced on every commit (locally via the Husky
 * `commit-msg` hook and in CI by `.github/workflows/commit-lint.yml`).
 *
 * `semantic-release` reads these commits to decide the next version and build
 * the changelog, so the rules match its `conventionalcommits` preset.
 *
 * @type {import("@commitlint/types").UserConfig}
 */
const config = {
  extends: ["@commitlint/config-conventional"],
};

export default config;
