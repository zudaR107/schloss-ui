# Changelog

Brief log of notable changes, grouped by theme — not a full commit history
(see `git log` for that). New entries get appended under the section they
fit best; add a new section if none fits.

## Setup
- Initial repo: README, LICENSE (AGPL-3.0), CONTRIBUTING.md, community
  health files (CODE_OF_CONDUCT.md, SECURITY.md, issue/PR templates).
- Package skeleton: `package.json` (`@zudar107/schloss-ui`, published to
  GitHub Packages), TypeScript config mirroring the other repos'
  strictness, tsup as the bundler (ESM + `.d.ts`), vitest +
  Testing Library for tests, oxlint for linting. CI runs lint/typecheck/
  test/build on every push and PR; a tag-triggered `publish.yml` builds
  and publishes on any `v*` tag, after checking the tag matches
  `package.json`'s version.

## Design tokens
- `src/tokens.css`: the core tokens already byte-identical across
  schloss/schlussel/kuvert (radius, shadow, font, neutral/text colors,
  semantic success/warning/danger/info) for light/dark/oled/sepia themes,
  extracted into one file with unchanged token names. `--accent`,
  `--accent-hover`, `--accent-muted`, `--accent-text`, and
  `--sidebar-accent` are deliberately left out - documented in
  README.md as a per-service contract instead, since they're each
  service's own brand identity, not shared state.
