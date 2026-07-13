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
- `Field`: a labeled input/select wrapper with a visible focus ring
  (border + `--accent-muted` shadow), an optional prefix slot (currency
  symbols on amount fields), a select variant with a trailing chevron,
  and error text rendered below the field. Generates an id via `useId`
  when the caller doesn't supply one, so the label is always properly
  associated via `htmlFor`.
- `Modal`: header row with an optional context icon badge, a real
  icon close-button (not a bare "×" glyph), a plain body slot, and a
  right-aligned footer built from `Button` - callers put the primary
  action last so it's rightmost. Card uses `--shadow-lg` instead of a
  flat 1px border.
- `StatTile`: a small summary card (label + tabular-nums value) - the
  same shape as kuvert's Budget "Осталось распределить" strip,
  generalized so other pages can show a quick summary above their
  content instead of empty space before a table.
- `Amount`: enforces sign-based coloring everywhere (positive
  `--success` + "+", negative `--danger` + real minus sign U+2212, zero
  stays `--text-primary` with no prefix) - today this is applied
  inconsistently (kuvert's Budget "Available" column colors by sign,
  account balances and transaction amounts elsewhere don't). Takes the
  raw signed value only to decide color/prefix; the caller still
  supplies the formatted magnitude text (currency/locale formatting
  stays the caller's concern, not this package's). Optional delta
  indicator (▲/▼ + percentage).
- `Sparkline`: a minimal bar-based mini chart (no axis, no labels,
  `--accent`-colored bars, `aria-hidden` since it's purely decorative)
  for a quick trend glance next to a stat.
- `Toast`: a genuinely missing pattern, not a fix for an existing one -
  a short, auto-dismissing (3.2s default, 0 disables it) confirmation
  after a form save succeeds or a request fails. Compact card
  (`--bg-surface`, `--border`, `--shadow-lg`), a small colored
  status-icon circle (`success`/`error`), bottom-right, `role="status"`
  so screen readers announce it. First real usage lands with whichever
  consuming-repo issue wires up Modal-driven forms.

## Icons
- Not a component - a written contract (in README.md), so icon usage
  stops being re-derived ad hoc. Today's sizes (15/18/20/24px) and
  strokeWidth (2/2.2 mixed) are inconsistent across the three services.
  lucide-react stays the canonical set. Exports `ICON_SIZE` (`dense: 14,
  default: 16, emphasis: 20, illustrative: 28`) so consuming code
  references a name instead of a magic number. `strokeWidth: 2` always.
  Four-state color rule: muted (`--text-secondary`) default/secondary
  action, primary (`--text-primary`) structural, accent (`--accent`)
  active/selected, white inside a filled `--accent` surface.

## Fixes
- `Button`, `Header`'s settings/logout icon buttons, and
  `SegmentedControl`'s inactive segments had no hover feedback -
  inline `style` objects can't express `:hover`, so all three shipped
  with a real regression versus the CSS-class-based buttons they
  replace. Fixed with an internal `useHover` hook (mouseenter/
  mouseleave state), not exported from the package.
- `Field`'s select-mode `prefix` prop collided with the native RDFa
  `prefix` attribute `SelectHTMLAttributes` inherits, breaking
  typechecking for a `ReactNode` prefix in select mode (input mode was
  unaffected). Fixed by omitting the native attribute the same way
  input mode already did. Also fixed a shorthand/longhand `border` vs
  `borderColor` mix in the focus-ring style that triggered a React
  dev-mode warning.
