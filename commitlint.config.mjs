import configConventional from "@commitlint/config-conventional";

/**
 * Conventional Commits, enforced on every commit (locally via the Husky
 * `commit-msg` hook and in CI by `.github/workflows/commit-lint.yml`).
 *
 * `semantic-release` reads these commits to decide the next version and build
 * the changelog, so the rules match its `conventionalcommits` preset.
 *
 * On top of the standard types we allow `breaking:` as a shorthand for a
 * major-version bump. `.releaserc.json` maps it to a `major` release and gives
 * it its own changelog section; without this rule `commitlint` would reject the
 * commit before it could get there.
 *
 * Dependabot's commits have a well-formed `chore(deps*):` header but a body of
 * pasted release notes that blows past `body-max-line-length`. They never
 * trigger a release, so they're skipped rather than reformatted.
 *
 * @type {import("@commitlint/types").UserConfig}
 */
const [level, applicable, types] = configConventional.rules["type-enum"];

const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [level, applicable, ["breaking", ...types]],
  },
  ignores: [(message) => message.includes("Signed-off-by: dependabot[bot]")],
};

export default config;
