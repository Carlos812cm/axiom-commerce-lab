# Axiom Commerce Lab

Axiom Commerce Lab is a premium multi-brand B2C technology commerce platform built as an enterprise-grade portfolio project.

The project is not intended to operate as a real commercial storefront. It is designed as a realistic engineering demonstration: a modern commerce system built with serious architecture, domain modeling, database design, performance discipline and deployment readiness in mind.

## Project thesis

Most portfolio e-commerce projects stop at products, a cart and a checkout button.

Axiom Commerce Lab is intentionally different. It is designed to demonstrate the engineering judgment expected beyond a typical Senior Full Stack Engineer role:

- modular monorepo architecture;
- domain-driven catalog, pricing and inventory modeling;
- premium design system foundations;
- PostgreSQL-backed storefront data;
- typed read models for UI-facing data access;
- realistic stock and reservation foundations;
- URL-addressable catalog filtering;
- documented architectural decisions;
- a roadmap toward search, checkout, admin operations, observability and deployment.

## Current status

Current stable version: `0.1.0`

Current milestone: `v0.2.0 - Product Listing Experience` in progress.

Foundation release includes:

- TypeScript monorepo with pnpm workspaces and Turborepo;
- Next.js storefront application;
- Next.js admin cockpit application;
- shared UI package with early design-system primitives;
- PostgreSQL + Drizzle database package;
- catalog, pricing and inventory schema;
- demo catalog seed;
- database-backed storefront pages;
- ADRs and architecture documentation.

The product listing milestone currently adds:

- category filters;
- brand filters;
- availability filters;
- price range filters;
- sorting by featured, name and price;
- URL state for shareable catalog views;
- catalog facets derived from the database-backed read model.

## Applications

```txt
apps/
  web/     Public storefront
  admin/   Internal operations cockpit
```

### Storefront

Local URL:

```txt
http://localhost:3000
```

Current implemented routes:

```txt
/
/products
/products/[slug]
```

Example product listing URLs:

```txt
/products
/products?category=laptops
/products?brand=nomad
/products?availability=low-stock
/products?minPrice=300&maxPrice=1000
/products?sort=price-desc
/products?category=laptops&brand=nomad&availability=in-stock&sort=price-desc
```

### Admin cockpit

Local URL:

```txt
http://localhost:3001
```

The admin application currently contains the first operational shell and will evolve into the management surface for catalog, stock, reservations, orders and search index operations.

## Packages

```txt
packages/
  ui/       Shared design system primitives
  db/       Database schema, client, migrations, seeds and catalog read models
  domain/   Framework-independent business rules and domain types
```

### `@axiom/ui`

The shared UI package contains the early design-system foundation:

- `Button`
- `Badge`
- `ProductCard`
- `ProductHero`
- shared Tailwind theme tokens
- shared utility helpers

The UI package is intentionally framework-agnostic. It does not depend on Next.js routing or image primitives.

### `@axiom/db`

The database package owns:

- Drizzle schema;
- PostgreSQL client;
- migration scripts;
- seed scripts;
- catalog read-model queries;
- catalog facet queries.

The storefront consumes UI-ready read models rather than raw table shapes.

### `@axiom/domain`

The domain package contains framework-independent business concepts and rules for:

- catalog identity;
- pricing and money operations;
- inventory snapshots;
- reservable stock calculation.

## Architecture

The project uses a modular monolith inside a TypeScript monorepo.

```txt
Browser
  |
  v
Next.js apps
  |
  |-- @axiom/ui
  |-- @axiom/domain
  |-- @axiom/db
          |
          v
      PostgreSQL
```

The current catalog model separates commercial product families from purchasable SKUs:

```txt
Brand
  -> Category
  -> Product
      -> ProductVariant
          -> SKU
              -> Price
              -> InventoryItem
              -> SkuSpecificationValue
```

This allows the project to support realistic technology-commerce features such as product variants, category-aware specifications, dynamic filtering, comparison, multi-warehouse inventory and future stock reservations.

### Catalog read model

The storefront reads catalog data through typed query functions instead of reading raw tables directly.

Current query surface:

```txt
getFeaturedProductCards(limit)
getCatalogProductCards(options)
getCatalogFacets()
getProductBySlug(slug)
```

The product listing page accepts filter state from `searchParams`, normalizes it into a catalog query object and generates filter links back into URL query parameters.

Current filter dimensions:

```txt
category
brand
availability
minPrice
maxPrice
sort
```

Availability is calculated from inventory using this invariant:

```txt
available_stock = on_hand - reserved - safety_stock
```

## Tech stack

Current foundation:

- TypeScript
- pnpm workspaces
- Turborepo
- Next.js
- React
- Tailwind CSS
- PostgreSQL
- Drizzle ORM
- Docker Compose

Planned additions:

- search projection for advanced faceted catalog navigation;
- cart and checkout flows;
- secure sandbox payments;
- stock reservation workflow;
- admin catalog and inventory operations;
- observability;
- CI/CD quality gates;
- deployment-ready demo environment.

## Local development

### Prerequisites

- Node.js
- pnpm
- Docker Desktop or compatible Docker runtime

### Setup

```bash
pnpm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Start PostgreSQL:

```bash
docker compose up -d postgres
```

Run database migrations:

```bash
pnpm db:migrate
```

Seed the demo catalog:

```bash
pnpm db:seed
```

Start all apps:

```bash
pnpm dev
```

Open:

```txt
Storefront: http://localhost:3000
Admin:      http://localhost:3001
```

## Scripts

Root scripts:

```bash
pnpm dev          # Run workspace dev tasks
pnpm build        # Build workspace packages/apps
pnpm typecheck    # Run TypeScript checks across the workspace
pnpm lint         # Run lint tasks across the workspace
pnpm test         # Run test tasks across the workspace
pnpm db:generate  # Generate Drizzle migrations
pnpm db:migrate   # Apply Drizzle migrations
pnpm db:seed      # Seed demo catalog data
pnpm db:studio    # Open Drizzle Studio
```

## Database

Local PostgreSQL is provided through Docker Compose:

```txt
postgres://axiom:axiom@localhost:5432/axiom_commerce_lab
```

The database schema currently includes foundations for:

- brands;
- categories;
- products;
- product variants;
- SKUs;
- product media;
- specification groups;
- specification definitions;
- SKU specification values;
- prices;
- warehouses;
- inventory items;
- stock reservations;
- inventory movements.

## Documentation

Architecture documentation lives in:

```txt
docs/
  adr/           Architectural Decision Records
  architecture/  Domain and visual architecture notes
  quality/       Performance and quality budgets
  runbooks/      Operational documentation
```

Important ADRs:

- `docs/adr/0001-architecture-style.md`
- `docs/adr/0002-design-system-strategy.md`
- `docs/adr/0003-catalog-data-model.md`

## Quality gates

Before committing substantial changes, run:

```bash
pnpm typecheck
```

As the project matures, this section will expand to include:

- linting enforcement;
- unit tests;
- integration tests;
- Playwright E2E tests;
- Lighthouse CI;
- security checks;
- deployment smoke tests.

## Roadmap

### v0.1.0 - Foundation

- Monorepo foundation
- Design-system foundation
- Catalog, pricing and inventory schema
- Demo seed
- Database-backed storefront

### v0.2.0 - Product Listing Experience

Status: in progress.

Implemented:

- category filters
- brand filters
- availability filters
- price range filters
- URL state for filters and sorting
- catalog facets
- product grid empty state

Remaining before tag:

- extract product listing UI into focused components
- add an ADR for URL-based catalog state
- improve mobile filter ergonomics
- harden facet behavior and document current query trade-offs

### v0.3.0 - Product Detail Experience

- richer product media
- variant selection
- specification matrix
- comparable specs
- stock-aware product configuration

### v0.4.0 - Cart Foundation

- cart drawer
- guest cart persistence
- server validation
- price and availability validation

### v0.5.0 - Checkout and Stock Reservation

- checkout session
- transactional stock reservation
- reservation expiry
- sandbox payment flow
- order creation

### v0.6.0 - Admin Cockpit

- catalog management
- inventory management
- reservation monitor
- order overview
- audit logs

### v0.7.0 - Search and Faceted Navigation

- search projection
- dynamic facets
- ranking strategy
- reindex workflow

### v0.8.0 - Hardening

- observability
- security checklist
- CI/CD pipeline
- performance budgets
- error handling

### v1.0.0 - Portfolio Release

- deployed demo
- polished README and docs
- technical demo script
- performance report
- interview-ready walkthrough

## Engineering principles

- Domain logic should not depend on Next.js.
- UI primitives should remain reusable and framework-agnostic.
- Database tables should not leak directly into page components.
- Storefront pages should consume typed read models.
- Catalog filter state should be URL-addressable.
- Inventory correctness should be treated as a core business invariant.
- Performance is a product feature, not a final decoration pass.

## License

No license has been selected yet.

Until a license is added, all rights are reserved by the repository owner.
