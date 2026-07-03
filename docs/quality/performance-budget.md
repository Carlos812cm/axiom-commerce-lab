# Performance Budget

## Goal

Axiom Commerce Lab must feel instantaneous, premium and stable.

The storefront should target excellent Core Web Vitals and disciplined client-side JavaScript usage.

## Public route targets

| Route | LCP | INP | CLS | Notes |
|---|---:|---:|---:|---|
| / | <= 2.0s | <= 150ms | <= 0.05 | Editorial home |
| /products | <= 2.5s | <= 200ms | <= 0.05 | Faceted PLP |
| /products/[slug] | <= 2.5s | <= 200ms | <= 0.05 | Heavy PDP media |
| /cart | <= 2.0s | <= 150ms | <= 0.05 | Interactive |
| /checkout | <= 2.5s | <= 200ms | <= 0.05 | Dynamic, secure |

## Engineering rules

- Server Components by default.
- Client Components only for interaction.
- No global client state for server data.
- Images must define dimensions or stable aspect ratios.
- Avoid layout shift during loading.
- Avoid unnecessary providers at root.
- Avoid large client bundles for static content.
- Use URL state for filters and sorting.
- Use streaming and skeletons where useful.
- Measure before optimizing.
