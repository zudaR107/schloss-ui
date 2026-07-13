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
same family, distinct identity. See `docs/` (once written) for the exact
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
