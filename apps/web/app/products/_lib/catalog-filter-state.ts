import type {
  CatalogProductAvailability,
  CatalogProductQueryOptions,
  CatalogProductSort
} from "@axiom/db";

export type SearchParamValue = string | string[] | undefined;

export type ProductsPageSearchParams = Record<string, SearchParamValue>;

export type ProductsHrefPatch = {
  categorySlug?: string | null | undefined;
  brandSlug?: string | null | undefined;
  availability?: CatalogProductAvailability | null | undefined;
  minPriceCents?: number | null | undefined;
  maxPriceCents?: number | null | undefined;
  sort?: CatalogProductSort | null | undefined;
};

export const availabilityOptions: {
  value: CatalogProductAvailability;
  label: string;
}[] = [
  { value: "in-stock", label: "In stock" },
  { value: "low-stock", label: "Low stock" },
  { value: "out-of-stock", label: "Out of stock" }
];

export const sortOptions: {
  value: CatalogProductSort;
  label: string;
}[] = [
  { value: "featured", label: "Featured" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "price-asc", label: "Price low to high" },
  { value: "price-desc", label: "Price high to low" }
];

function getSingleParam(value: SearchParamValue): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function parseCentsFromDollars(value: string | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim();

  if (!normalized) {
    return undefined;
  }

  const amount = Number(normalized);

  if (!Number.isFinite(amount) || amount < 0) {
    return undefined;
  }

  return Math.round(amount * 100);
}

function isAvailability(value: string | undefined): value is CatalogProductAvailability {
  return value === "in-stock" || value === "low-stock" || value === "out-of-stock";
}

function isSort(value: string | undefined): value is CatalogProductSort {
  return (
    value === "featured" ||
    value === "name-asc" ||
    value === "price-asc" ||
    value === "price-desc"
  );
}

export function parseCatalogFilters(
  rawSearchParams: ProductsPageSearchParams
): CatalogProductQueryOptions {
  const filters: CatalogProductQueryOptions = {};

  const categorySlug = getSingleParam(rawSearchParams["category"]);
  const brandSlug = getSingleParam(rawSearchParams["brand"]);
  const availability = getSingleParam(rawSearchParams["availability"]);
  const sort = getSingleParam(rawSearchParams["sort"]);

  const minPriceCents = parseCentsFromDollars(getSingleParam(rawSearchParams["minPrice"]));
  const maxPriceCents = parseCentsFromDollars(getSingleParam(rawSearchParams["maxPrice"]));

  if (categorySlug) {
    filters.categorySlug = categorySlug;
  }

  if (brandSlug) {
    filters.brandSlug = brandSlug;
  }

  if (isAvailability(availability)) {
    filters.availability = availability;
  }

  if (typeof minPriceCents === "number") {
    filters.minPriceCents = minPriceCents;
  }

  if (typeof maxPriceCents === "number") {
    filters.maxPriceCents = maxPriceCents;
  }

  if (isSort(sort)) {
    filters.sort = sort;
  }

  return filters;
}

export function createProductsHref(
  currentFilters: CatalogProductQueryOptions,
  patch: ProductsHrefPatch
): string {
  const nextFilters: CatalogProductQueryOptions = { ...currentFilters };

  if ("categorySlug" in patch) {
    if (patch.categorySlug) {
      nextFilters.categorySlug = patch.categorySlug;
    } else {
      delete nextFilters.categorySlug;
    }
  }

  if ("brandSlug" in patch) {
    if (patch.brandSlug) {
      nextFilters.brandSlug = patch.brandSlug;
    } else {
      delete nextFilters.brandSlug;
    }
  }

  if ("availability" in patch) {
    if (patch.availability) {
      nextFilters.availability = patch.availability;
    } else {
      delete nextFilters.availability;
    }
  }

  if ("minPriceCents" in patch) {
    if (typeof patch.minPriceCents === "number") {
      nextFilters.minPriceCents = patch.minPriceCents;
    } else {
      delete nextFilters.minPriceCents;
    }
  }

  if ("maxPriceCents" in patch) {
    if (typeof patch.maxPriceCents === "number") {
      nextFilters.maxPriceCents = patch.maxPriceCents;
    } else {
      delete nextFilters.maxPriceCents;
    }
  }

  if ("sort" in patch) {
    if (patch.sort) {
      nextFilters.sort = patch.sort;
    } else {
      delete nextFilters.sort;
    }
  }

  const params = new URLSearchParams();

  if (nextFilters.categorySlug) {
    params.set("category", nextFilters.categorySlug);
  }

  if (nextFilters.brandSlug) {
    params.set("brand", nextFilters.brandSlug);
  }

  if (nextFilters.availability) {
    params.set("availability", nextFilters.availability);
  }

  if (typeof nextFilters.minPriceCents === "number") {
    params.set("minPrice", String(Math.round(nextFilters.minPriceCents / 100)));
  }

  if (typeof nextFilters.maxPriceCents === "number") {
    params.set("maxPrice", String(Math.round(nextFilters.maxPriceCents / 100)));
  }

  if (nextFilters.sort && nextFilters.sort !== "featured") {
    params.set("sort", nextFilters.sort);
  }

  const query = params.toString();

  return query ? `/products?${query}` : "/products";
}

export function formatPriceInput(amountCents: number | undefined): string {
  if (typeof amountCents !== "number") {
    return "";
  }

  return String(Math.round(amountCents / 100));
}

export function getActiveFilterCount(filters: CatalogProductQueryOptions): number {
  return [
    filters.categorySlug,
    filters.brandSlug,
    filters.availability,
    typeof filters.minPriceCents === "number" ? "minPrice" : undefined,
    typeof filters.maxPriceCents === "number" ? "maxPrice" : undefined,
    filters.sort && filters.sort !== "featured" ? filters.sort : undefined
  ].filter(Boolean).length;
}
