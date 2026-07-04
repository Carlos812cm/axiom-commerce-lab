# ADR 0004: URL-Based Catalog State

## Status

Accepted

## Context

The product listing page needs to support category, brand, availability, price and sorting filters.

Catalog filters are part of the user's navigation state. Users should be able to reload the page, share filtered URLs and move backward or forward through browser history without losing their current catalog view.

Alternative approaches include storing filter state in client-side global state or local component state.

## Decision

We will represent product listing filters in the URL query string.

Current query parameters:

- `category`
- `brand`
- `availability`
- `minPrice`
- `maxPrice`
- `sort`

Example:

```txt
/products?category=laptops&brand=nomad&availability=in-stock&sort=price-desc

The page will parse searchParams on the server, normalize them into a CatalogProductQueryOptions object and pass that object to the catalog read model.

Filter links will be generated from the current filter state plus a patch object.

Rationale

URL-based state is appropriate for catalog navigation because it is:

shareable;
reload-safe;
browser-history friendly;
server-rendering friendly;
compatible with future SEO and analytics needs;
easier to reason about than hidden global UI state.

This keeps catalog state close to the navigation model instead of hiding it inside client-only stores.

Consequences

Positive:

Filtered catalog views can be shared.
Reloading the page preserves the selected filters.
Server Components can read filter state directly.
Back and forward navigation work naturally.
No global client state is needed for product listing filters.

Negative:

Query parameter parsing must be explicit.
URL generation helpers must remain well-tested.
Complex filter shapes can make URLs longer.
Some highly interactive controls may require progressive enhancement later.
Current trade-offs

The current implementation filters category, brand and price in the database query.

Availability is calculated from inventory using:

available_stock = on_hand - reserved - safety_stock

Because availability is an aggregate, the current implementation applies availability filtering after the read model maps rows into product cards.

This is acceptable for the current demo catalog size.

For larger catalogs, this should move to one of the following:

SQL subquery with aggregate filtering;
materialized read model;
search projection;
dedicated faceted search engine.
Fitness Functions

This decision remains healthy if:

filtered URLs can be shared and reloaded;
browser back/forward navigation preserves catalog state;
page components do not introduce global state for filters;
filter parsing is centralized;
URL generation is centralized;
future search integration can reuse or map from the same URL contract.