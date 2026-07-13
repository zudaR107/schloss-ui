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

## Components
- `Header`: the logo slot is itself the home link (no separate visible
  "На главную" text); a user's name is shown as a single-initial avatar
  circle instead of text; settings/logout are icon-only buttons gated on
  a user being present; `leftSlot`/`rightSlot` cover service-specific
  extras (a mobile nav toggle, a theme toggle).
- `Footer`: extracted as-is, parameterized by `serviceName`.
- `EmptyState`: replaces raw-emoji empty states with an accent-tinted
  icon badge, a title, one sentence of copy, and a primary action
  button.
- `Button`: one pill of variants (`primary`/`secondary`/`ghost`/`danger`)
  replacing today's ad hoc button classes, consistent radius/padding/
  weight/icon-gap across all four.
- `Badge`: one pill shape replacing today's three ad hoc status styles,
  five semantic variants (`success`/`danger`/`info`/`warning`/`neutral`)
  with an optional leading dot for state badges. Adds
  `--badge-{success,danger,info,warning}-{bg,text}` tokens to
  `tokens.css` - these intentionally differ from `--success` etc. (the
  badge text shades are tuned for contrast against the muted
  background, not identical to the general semantic color); `neutral`
  reuses `--border`/`--text-secondary` directly.
- `SegmentedControl`: replaces the two-separate-buttons filter pattern
  (e.g. kuvert's Debts Активные/Закрытые toggle) with one container and
  an active-segment highlight.

## Fixes
- `Button`, `Header`'s settings/logout icon buttons, and
  `SegmentedControl`'s inactive segments had no hover feedback -
  inline `style` objects can't express `:hover`, so all three shipped
  with a real regression versus the CSS-class-based buttons they
  replace. Fixed with an internal `useHover` hook (mouseenter/
  mouseleave state), not exported from the package.
