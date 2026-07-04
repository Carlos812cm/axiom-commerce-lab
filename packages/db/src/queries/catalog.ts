import { and, asc, desc, eq, gte, lte, sql, type SQL } from "drizzle-orm";

import { db } from "../client";
import {
  brands,
  categories,
  inventoryItems,
  prices,
  productMedia,
  products,
  productVariants,
  skus,
  skuSpecificationValues,
  specificationDefinitions,
  specificationGroups
} from "../schema";

export type CatalogProductAvailability = "in-stock" | "low-stock" | "out-of-stock";

export type CatalogProductSort =
  | "featured"
  | "name-asc"
  | "price-asc"
  | "price-desc";

export type CatalogProductQueryOptions = {
  featuredOnly?: boolean;
  limit?: number;
  categorySlug?: string;
  brandSlug?: string;
  availability?: CatalogProductAvailability;
  minPriceCents?: number;
  maxPriceCents?: number;
  sort?: CatalogProductSort;
};

export type CatalogProductCard = {
  productId: string;
  slug: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  name: string;
  subtitle: string | null;
  skuCode: string;
  amountCents: number;
  currencyCode: string;
  availableStock: number;
  isFeatured: boolean;
};

export type CatalogFacetOption = {
  slug: string;
  label: string;
  count: number;
};

export type CatalogFacets = {
  categories: CatalogFacetOption[];
  brands: CatalogFacetOption[];
  availability: {
    inStock: number;
    lowStock: number;
    outOfStock: number;
  };
  priceRange: {
    minAmountCents: number;
    maxAmountCents: number;
  };
};

export type CatalogProductSpecification = {
  key: string;
  label: string;
  unit: string | null;
  dataType: "text" | "number" | "boolean" | "json";
  isComparable: boolean;
  value: string | number | boolean | Record<string, unknown> | null;
  displayValue: string;
};

export type CatalogProductSpecificationGroup = {
  groupId: string;
  name: string;
  specifications: CatalogProductSpecification[];
};

export type CatalogProductDetail = {
  productId: string;
  slug: string;
  brand: string;
  category: string;
  name: string;
  subtitle: string | null;
  description: string | null;
  media: {
    url: string;
    alt: string;
    role: string;
    width: number | null;
    height: number | null;
  }[];
  variants: {
    variantId: string;
    variantName: string;
    colorName: string | null;
    colorHex: string | null;
    skuId: string;
    skuCode: string;
    skuTitle: string;
    amountCents: number;
    currencyCode: string;
    availableStock: number;
  }[];
  specificationGroups: CatalogProductSpecificationGroup[];
};

function toNumber(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function formatNumber(value: number): string {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function mapCardRow(row: {
  productId: string;
  slug: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  name: string;
  subtitle: string | null;
  skuCode: string;
  amountCents: number;
  currencyCode: string;
  availableStock: unknown;
  isFeatured: boolean;
}): CatalogProductCard {
  return {
    ...row,
    availableStock: Math.max(0, toNumber(row.availableStock))
  };
}

function matchesAvailability(
  product: CatalogProductCard,
  availability: CatalogProductAvailability | undefined
): boolean {
  if (!availability) {
    return true;
  }

  if (availability === "in-stock") {
    return product.availableStock > 0;
  }

  if (availability === "low-stock") {
    return product.availableStock > 0 && product.availableStock <= 5;
  }

  return product.availableStock <= 0;
}

function sortCatalogCards(
  cards: CatalogProductCard[],
  sort: CatalogProductSort | undefined
): CatalogProductCard[] {
  const sorted = [...cards];

  if (sort === "name-asc") {
    sorted.sort((left, right) => left.name.localeCompare(right.name));
    return sorted;
  }

  if (sort === "price-asc") {
    sorted.sort((left, right) => left.amountCents - right.amountCents);
    return sorted;
  }

  if (sort === "price-desc") {
    sorted.sort((left, right) => right.amountCents - left.amountCents);
    return sorted;
  }

  sorted.sort(
    (left, right) =>
      Number(right.isFeatured) - Number(left.isFeatured) ||
      left.name.localeCompare(right.name)
  );

  return sorted;
}

async function selectCatalogProductCards(
  options: CatalogProductQueryOptions = {}
): Promise<CatalogProductCard[]> {
  const conditions: SQL[] = [
    eq(products.status, "active"),
    eq(productVariants.isDefault, true),
    eq(skus.status, "active"),
    eq(prices.status, "active")
  ];

  if (options.featuredOnly) {
    conditions.push(eq(products.isFeatured, true));
  }

  if (options.categorySlug) {
    conditions.push(eq(categories.slug, options.categorySlug));
  }

  if (options.brandSlug) {
    conditions.push(eq(brands.slug, options.brandSlug));
  }

  if (typeof options.minPriceCents === "number") {
    conditions.push(gte(prices.amountCents, options.minPriceCents));
  }

  if (typeof options.maxPriceCents === "number") {
    conditions.push(lte(prices.amountCents, options.maxPriceCents));
  }

  const query = db
    .select({
      productId: products.id,
      slug: products.slug,
      brand: brands.name,
      brandSlug: brands.slug,
      category: categories.name,
      categorySlug: categories.slug,
      name: products.title,
      subtitle: products.subtitle,
      skuCode: skus.code,
      amountCents: prices.amountCents,
      currencyCode: prices.currencyCode,
      availableStock: sql`
        coalesce(
          sum(
            greatest(
              ${inventoryItems.onHand} - ${inventoryItems.reserved} - ${inventoryItems.safetyStock},
              0
            )
          ),
          0
        )
      `,
      isFeatured: products.isFeatured
    })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .innerJoin(productVariants, eq(productVariants.productId, products.id))
    .innerJoin(skus, eq(skus.variantId, productVariants.id))
    .innerJoin(prices, eq(prices.skuId, skus.id))
    .leftJoin(inventoryItems, eq(inventoryItems.skuId, skus.id))
    .where(and(...conditions))
    .groupBy(
      products.id,
      products.slug,
      products.title,
      products.subtitle,
      products.isFeatured,
      brands.name,
      brands.slug,
      categories.name,
      categories.slug,
      skus.code,
      prices.amountCents,
      prices.currencyCode
    )
    .orderBy(desc(products.isFeatured), asc(products.title));

  const rows = typeof options.limit === "number" ? await query.limit(options.limit) : await query;

  const cards = rows
    .map(mapCardRow)
    .filter((product) => matchesAvailability(product, options.availability));

  return sortCatalogCards(cards, options.sort).slice(0, options.limit);
}

function incrementFacetCount(
  map: Map<string, CatalogFacetOption>,
  slug: string,
  label: string
): void {
  const current = map.get(slug);

  if (current) {
    current.count += 1;
    return;
  }

  map.set(slug, {
    slug,
    label,
    count: 1
  });
}

function sortFacetOptions(options: CatalogFacetOption[]): CatalogFacetOption[] {
  return [...options].sort((left, right) => left.label.localeCompare(right.label));
}

function resolveSpecificationValue(row: {
  dataType: "text" | "number" | "boolean" | "json";
  unit: string | null;
  valueText: string | null;
  valueNumber: string | null;
  valueBoolean: boolean | null;
  valueJson: Record<string, unknown> | null;
}): {
  value: string | number | boolean | Record<string, unknown> | null;
  displayValue: string;
} {
  if (row.dataType === "text") {
    return {
      value: row.valueText,
      displayValue: row.valueText ?? "—"
    };
  }

  if (row.dataType === "number") {
    const value = toNumber(row.valueNumber);
    const displayValue = row.unit ? `${formatNumber(value)} ${row.unit}` : formatNumber(value);

    return {
      value,
      displayValue
    };
  }

  if (row.dataType === "boolean") {
    return {
      value: row.valueBoolean,
      displayValue: row.valueBoolean ? "Yes" : "No"
    };
  }

  return {
    value: row.valueJson,
    displayValue: row.valueJson ? JSON.stringify(row.valueJson) : "—"
  };
}

async function getSpecificationGroupsForSku(
  skuId: string
): Promise<CatalogProductSpecificationGroup[]> {
  const rows = await db
    .select({
      groupId: specificationGroups.id,
      groupName: specificationGroups.name,
      key: specificationDefinitions.key,
      label: specificationDefinitions.label,
      unit: specificationDefinitions.unit,
      dataType: specificationDefinitions.dataType,
      isComparable: specificationDefinitions.isComparable,
      valueText: skuSpecificationValues.valueText,
      valueNumber: skuSpecificationValues.valueNumber,
      valueBoolean: skuSpecificationValues.valueBoolean,
      valueJson: skuSpecificationValues.valueJson
    })
    .from(skuSpecificationValues)
    .innerJoin(
      specificationDefinitions,
      eq(skuSpecificationValues.specificationDefinitionId, specificationDefinitions.id)
    )
    .innerJoin(specificationGroups, eq(specificationDefinitions.groupId, specificationGroups.id))
    .where(eq(skuSpecificationValues.skuId, skuId))
    .orderBy(asc(specificationGroups.sortOrder), asc(specificationDefinitions.sortOrder));

  const groups = new Map<string, CatalogProductSpecificationGroup>();

  for (const row of rows) {
    const currentGroup =
      groups.get(row.groupId) ??
      ({
        groupId: row.groupId,
        name: row.groupName,
        specifications: []
      } satisfies CatalogProductSpecificationGroup);

    const resolvedValue = resolveSpecificationValue({
      dataType: row.dataType,
      unit: row.unit,
      valueText: row.valueText,
      valueNumber: row.valueNumber,
      valueBoolean: row.valueBoolean,
      valueJson: row.valueJson
    });

    currentGroup.specifications.push({
      key: row.key,
      label: row.label,
      unit: row.unit,
      dataType: row.dataType,
      isComparable: row.isComparable,
      value: resolvedValue.value,
      displayValue: resolvedValue.displayValue
    });

    groups.set(row.groupId, currentGroup);
  }

  return [...groups.values()];
}

export async function getCatalogFacets(): Promise<CatalogFacets> {
  const cards = await selectCatalogProductCards();

  const categoriesMap = new Map<string, CatalogFacetOption>();
  const brandsMap = new Map<string, CatalogFacetOption>();

  let minAmountCents = Number.POSITIVE_INFINITY;
  let maxAmountCents = 0;

  const availability = {
    inStock: 0,
    lowStock: 0,
    outOfStock: 0
  };

  for (const product of cards) {
    incrementFacetCount(categoriesMap, product.categorySlug, product.category);
    incrementFacetCount(brandsMap, product.brandSlug, product.brand);

    minAmountCents = Math.min(minAmountCents, product.amountCents);
    maxAmountCents = Math.max(maxAmountCents, product.amountCents);

    if (product.availableStock <= 0) {
      availability.outOfStock += 1;
    } else {
      availability.inStock += 1;

      if (product.availableStock <= 5) {
        availability.lowStock += 1;
      }
    }
  }

  return {
    categories: sortFacetOptions([...categoriesMap.values()]),
    brands: sortFacetOptions([...brandsMap.values()]),
    availability,
    priceRange: {
      minAmountCents: Number.isFinite(minAmountCents) ? minAmountCents : 0,
      maxAmountCents
    }
  };
}

export async function getCatalogProductCards(
  options: CatalogProductQueryOptions = {}
): Promise<CatalogProductCard[]> {
  return selectCatalogProductCards(options);
}

export async function getFeaturedProductCards(limit = 3): Promise<CatalogProductCard[]> {
  return selectCatalogProductCards({
    featuredOnly: true,
    limit
  });
}

export async function getProductBySlug(slug: string): Promise<CatalogProductDetail | null> {
  const [product] = await db
    .select({
      productId: products.id,
      slug: products.slug,
      brand: brands.name,
      category: categories.name,
      name: products.title,
      subtitle: products.subtitle,
      description: products.description
    })
    .from(products)
    .innerJoin(brands, eq(products.brandId, brands.id))
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.slug, slug), eq(products.status, "active")))
    .limit(1);

  if (!product) {
    return null;
  }

  const variantRows = await db
    .select({
      variantId: productVariants.id,
      variantName: productVariants.name,
      colorName: productVariants.colorName,
      colorHex: productVariants.colorHex,
      skuId: skus.id,
      skuCode: skus.code,
      skuTitle: skus.title,
      amountCents: prices.amountCents,
      currencyCode: prices.currencyCode,
      availableStock: sql`
        coalesce(
          sum(
            greatest(
              ${inventoryItems.onHand} - ${inventoryItems.reserved} - ${inventoryItems.safetyStock},
              0
            )
          ),
          0
        )
      `
    })
    .from(productVariants)
    .innerJoin(skus, eq(skus.variantId, productVariants.id))
    .innerJoin(prices, eq(prices.skuId, skus.id))
    .leftJoin(inventoryItems, eq(inventoryItems.skuId, skus.id))
    .where(
      and(
        eq(productVariants.productId, product.productId),
        eq(skus.status, "active"),
        eq(prices.status, "active")
      )
    )
    .groupBy(
      productVariants.id,
      productVariants.name,
      productVariants.colorName,
      productVariants.colorHex,
      skus.id,
      skus.code,
      skus.title,
      prices.amountCents,
      prices.currencyCode
    )
    .orderBy(asc(productVariants.sortOrder), asc(skus.title));

  const variants = variantRows.map((variant) => ({
    ...variant,
    availableStock: Math.max(0, toNumber(variant.availableStock))
  }));

  const mediaRows = await db
    .select({
      url: productMedia.url,
      alt: productMedia.alt,
      role: productMedia.role,
      width: productMedia.width,
      height: productMedia.height
    })
    .from(productMedia)
    .where(eq(productMedia.productId, product.productId))
    .orderBy(asc(productMedia.sortOrder));

  const primarySkuId = variants[0]?.skuId;
  const specificationGroups = primarySkuId
    ? await getSpecificationGroupsForSku(primarySkuId)
    : [];

  return {
    ...product,
    media: mediaRows,
    variants,
    specificationGroups
  };
}
