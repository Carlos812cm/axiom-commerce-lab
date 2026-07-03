# ADR 0001: Architecture Style

## Status

Accepted

## Context

Axiom Commerce Lab is a portfolio-grade B2C e-commerce platform for multi-brand technology products. The project must demonstrate skills beyond Senior Full Stack Engineering, including architecture, domain modeling, performance engineering, security, observability, CI/CD, and operational thinking.

The project is not intended for real commercial production, but it will be designed as if it could evolve toward production-grade scale.

## Decision

We will use a modular monolith inside a TypeScript monorepo.

The system will be organized into applications and internal packages:

- apps/web: public storefront
- apps/admin: internal operations cockpit
- apps/worker: asynchronous processing
- packages/domain: pure business rules
- packages/db: database schema, connection and migrations
- packages/ui: shared design system
- packages/contracts: shared schemas and DTOs
- packages/observability: logging, tracing and metrics

## Rationale

A modular monolith gives us strong internal boundaries without the operational overhead of premature microservices.

The main architectural goal is to make domain boundaries explicit while keeping local development, testing and deployment manageable.

This approach allows future extraction of services if a domain becomes independently scalable or operationally isolated.

## Consequences

Positive:

- Simpler local development.
- Strong code sharing.
- Clear domain boundaries.
- Easier refactoring.
- Realistic enterprise architecture without distributed-system theater.

Negative:

- Requires discipline to prevent module coupling.
- Requires explicit package boundaries.
- Requires documentation and architectural enforcement.

## Fitness Functions

This decision remains healthy if:

- domain logic does not depend on Next.js;
- database logic does not leak into UI components;
- apps import from packages through public exports;
- business rules can be unit-tested without infrastructure;
- checkout and inventory workflows can be tested independently.
