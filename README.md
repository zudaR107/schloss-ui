# schloss-ui

[![License: AGPL v3](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](LICENSE)

Shared design tokens and layout components for the [Schloss
platform](https://github.com/zudaR107/Hof) — the design-system package
consumed by [`schloss`](https://github.com/zudaR107/schloss),
[`schlussel`](https://github.com/zudaR107/schlussel)'s web app, and
[`kuvert`](https://github.com/zudaR107/kuvert)'s web app.

## What this is (and isn't)

Every Schloss service already shares the same underlying design tokens
(spacing, radius, shadow, typography, neutral and semantic colors) — they
were just hand-copied into each repo independently, drifting slightly
with every edit. This package makes that sharing real: one source of
truth, versioned and installed like any other dependency, instead of
three copies to keep in sync by hand.

What it deliberately does **not** do: force every service to look
identical. Each service keeps its own brand mark (its own hand-drawn
logo/icon) and its own accent color, layered on top of the shared core —
same family, distinct identity. See "Design tokens" below for the exact
pattern.

## Status

Early scaffolding — see the [issue tracker](https://github.com/zudaR107/schloss-ui/issues)
for the buildout plan.

## Installing

Published to GitHub Packages, not npmjs.com. Consumers need a `.npmrc`
pointing the `@zudar107` scope at it:

```
@zudar107:registry=https://npm.pkg.github.com
```

Then install as usual: `pnpm add @zudar107/schloss-ui`. Publishing a new
version to GitHub Packages requires an authenticated `read:packages`
token even though the package itself is public.

## Design tokens

`import '@zudar107/schloss-ui/tokens.css'` (once, in each app's entry
point, before any of its own CSS) brings in every core token as a CSS
custom property: radius (`--radius-sm/md/lg/xl`), shadow
(`--shadow-sm/md/lg`), font (`--font-sans`), and the full neutral/text/
semantic (`--success/warning/danger/info`) palette for four themes,
switched via `data-theme="light|dark|oled|sepia"` on `<html>` (defaults
to light).

**Not** included, by design — each consumer defines these itself, on top
of the shared tokens, as its own brand identity:

| Token | schloss | schlussel | kuvert |
|---|---|---|---|
| `--accent` | `#863bff` | `#3b82f6` | `#0d9488` |
| `--accent-hover` | `#7228e0` | `#2563eb` | `#0b7d73` |
| `--accent-muted` | `#f3ebff` | `#eff6ff` | `#ccfbf1` |
| `--accent-text` | pick a legible text-on-muted shade near your accent | `#1d4ed8` | pick similarly |
| `--sidebar-accent` | same as `--accent` | same as `--accent` | same as `--accent` |

Two colors were chosen deliberately, not just picked-to-differ:
schloss's accent now matches its own logo (previously mismatched — blue
UI, purple logo); kuvert's teal is intentionally distinct from the
shared `--success` green so "brand accent" and "positive/success" don't
read as the same signal. schlussel keeps the platform's original blue as
its own signature.

`--sidebar-accent` is listed here (not left to inherit a hardcoded
value) because it's accent-derived, not neutral — leaving it in the
shared file would silently keep every service's sidebar highlight blue
regardless of its own `--accent`, the exact kind of accidental-default
bleed this package exists to prevent.

## Developing

```sh
pnpm install
pnpm lint       # oxlint
pnpm typecheck  # tsc --noEmit
pnpm test       # vitest
pnpm build      # tsup -> dist/ (ESM + .d.ts)
```

Releases are tag-triggered: pushing a `v*` tag on `main` (after bumping
`version` in `package.json` to match) runs the full check suite and
publishes to GitHub Packages.

## License

AGPL-3.0 — see [LICENSE](LICENSE).
