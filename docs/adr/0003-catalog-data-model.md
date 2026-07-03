# ADR 0003: Catalog Data Model

## Status

Accepted

## Context

Axiom Commerce Lab is a vertical B2C technology commerce platform. Technology products have rich specifications, variants, SKUs, product media, pricing rules and inventory constraints.

A flat `products` table would not represent the business correctly.

## Decision

We will model catalog data using the following hierarchy:

- Brand
- Category
- Product
- ProductVariant
- SKU
- ProductMedia
- SpecificationGroup
- SpecificationDefinition
- SkuSpecificationValue
- Price
- Warehouse
- InventoryItem
- StockReservation
- InventoryMovement

Products represent commercial product families.

Variants represent option groups such as color or edition.

SKUs represent purchasable units.

Specifications are category-aware and can be filterable or comparable.

Inventory is tracked per SKU and warehouse.

Prices are attached to SKUs and stored as integer cents.

## Rationale

This structure supports realistic technology commerce use cases:

- product detail pages with variants;
- category-specific specifications;
- faceted search;
- product comparison;
- inventory reservation;
- multi-warehouse stock;
- audit-friendly inventory movements;
- future search index projections.

## Consequences

Positive:

- Rich catalog modeling.
- Strong base for dynamic filters.
- Clear separation between product, variant and SKU.
- Better support for inventory correctness.
- Better interview discussion surface.

Negative:

- More joins.
- More seed data required.
- More admin complexity.
- Requires careful indexing.

## Fitness Functions

This decision remains healthy if:

- every purchasable item maps to exactly one SKU;
- product pages can display variants without duplicating product families;
- category filters can be generated from specification definitions;
- inventory can be calculated per SKU and warehouse;
- price lookups can be performed without scanning the entire catalog;
- stock reservations can be audited.
