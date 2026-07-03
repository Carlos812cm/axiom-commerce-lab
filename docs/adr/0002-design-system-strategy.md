# ADR 0002: Design System Strategy

## Status

Accepted

## Context

Axiom Commerce Lab must communicate premium quality, technical sophistication and enterprise-level engineering. A generic component library theme would weaken the portfolio value of the project.

The platform needs shared UI primitives for the storefront, admin cockpit and future engineering documentation surfaces.

## Decision

We will create a custom design system in `packages/ui`.

The visual direction is "Luxury Tech Showroom": dark mineral surfaces, precise typography, subtle depth, restrained accent color, generous spacing and high-performance interactions.

The UI package will expose framework-agnostic primitives. It will not import Next.js-specific primitives like `next/link` or `next/image`.

Tailwind CSS theme variables will define the first design tokens.

## Rationale

A custom UI package demonstrates frontend architecture maturity and avoids coupling product design to a single app.

Framework-agnostic components are easier to reuse, test and migrate.

Design tokens make the visual language explicit and prevent arbitrary styling decisions from spreading across the codebase.

## Consequences

Positive:

- Consistent visual language.
- Shared UI across web and admin.
- Better separation between product design and application framework.
- Stronger portfolio signal.

Negative:

- More initial setup.
- Requires discipline to prevent one-off styles.
- Requires component documentation as the system grows.

## Fitness Functions

This decision remains healthy if:

- shared components do not import from Next.js;
- app-specific behavior remains inside apps;
- design tokens are reused instead of duplicated;
- components remain accessible by default;
- visual changes can be made centrally without editing every screen.
