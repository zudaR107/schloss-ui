# Security Policy

## Supported versions

Only the latest published version on GitHub Packages is supported —
there are no maintained release branches.

## Reporting a vulnerability

Please do not open a public issue for security vulnerabilities. Instead,
use GitHub's private reporting flow:

1. Go to the [Security tab](../../security) of this repository.
2. Click "Report a vulnerability".
3. Describe the issue, including reproduction steps if you have them.

This is a small, mostly-solo project, so response time is best-effort, not
contractual — but you can expect an initial reply within a few days.

## Scope

This package's components render inside every other Schloss service, so a
vulnerability here (e.g. XSS via an unsanitized prop) has platform-wide
reach. In scope: anything in the `Header`/`Footer`/`BrandBadge` components
that could execute untrusted content, and anything in the publish pipeline
that could let an unauthorized party publish a malicious version.
