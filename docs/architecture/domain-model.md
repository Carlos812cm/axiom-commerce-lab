# Domain Model

## Core domains

Axiom Commerce Lab is divided into business domains that can evolve independently inside a modular monolith.

## Catalog

Owns product identity, classification, variants, SKUs, specifications and media.

Main entities:

- Brand
- Category
- Product
- ProductVariant
- SKU
- ProductMedia
- SpecificationGroup
- SpecificationDefinition
- SkuSpecificationValue

Core rules:

- A Product is a commercial product family.
- A ProductVariant belongs to one Product.
- A SKU belongs to one ProductVariant.
- Only SKUs are purchasable.
- Specifications are category-aware.
- Specifications can be filterable and/or comparable.

## Pricing

Owns price representation and future promotional rules.

Main entities:

- Price
- Money
- PriceBreakdown

Core rules:

- Money is represented in integer cents.
- A price belongs to a SKU.
- Price lookup must consider currency and status.

## Inventory

Owns physical stock, reserved stock, warehouses, stock reservations and inventory movements.

Main entities:

- Warehouse
- InventoryItem
- StockReservation
- InventoryMovement

Core invariant:

available_stock = on_hand - reserved - safety_stock

A checkout can reserve stock only when:

available_stock >= requested_quantity

## Search

Owns product indexing, dynamic filtering, faceted navigation, ranking and read-model synchronization.

Search will not be the source of truth. PostgreSQL is the source of truth. Search will be a projection.

## Cart

Owns guest carts, customer carts, cart lines, cart merge and cart validation.

## Checkout

Owns checkout sessions, stock reservation, payment attempt and order creation.

## Orders

Owns customer orders, order status transitions and fulfillment simulation.

## Admin Operations

Owns internal workflows, audit logs, catalog management, inventory management, order review and operational controls.
