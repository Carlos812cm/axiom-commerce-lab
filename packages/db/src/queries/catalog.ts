import { and, asc, desc, eq, sql } from "drizzle-orm";

import { db } from "../client";
import {
  brands,
  categories,
  inventoryItems,
  prices,
  productMedia,
  products,
  productVariants,
  skus
} from "../schema";

export type CatalogProductCard = {
  productId: string;
  slug: string;
  brand: string;
  name: string;
  subtitle: string | null;
  skuCode: string;
  amountCents: number;
  currencyCode: string;
  availableStock: number;
  isFeatured: boolean;
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

function mapCardRow(row: {
  productId: string;
  slug: string;
  brand: string;
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

async function selectCatalogProductCards(options: {
  featuredOnly?: boolean;
  limit?: number;
}): Promise<CatalogProductCard[]> {
  const whereClause = options.featuredOnly
    ? and(
        eq(products.status, "active"),
        eq(products.isFeatured, true),
        eq(productVariants.isDefault, true),
        eq(skus.status, "active"),
        eq(prices.status, "active")
      )
    : and(
        eq(products.status, "active"),
        eq(productVariants.isDefault, true),
        eq(skus.status, "active"),
        eq(prices.status, "active")
      );

  const query = db
    .select({
      productId: products.id,
      slug: products.slug,
      brand: brands.name,
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
    .innerJoin(productVariants, eq(productVariants.productId, products.id))
    .innerJoin(skus, eq(skus.variantId, productVariants.id))
    .innerJoin(prices, eq(prices.skuId, skus.id))
    .leftJoin(inventoryItems, eq(inventoryItems.skuId, skus.id))
    .where(whereClause)
    .groupBy(
      products.id,
      products.slug,
      products.title,
      products.subtitle,
      products.isFeatured,
      brands.name,
      skus.code,
      prices.amountCents,
      prices.currencyCode
    )
    .orderBy(desc(products.isFeatured), asc(products.title));

  const rows = typeof options.limit === "number" ? await query.limit(options.limit) : await query;

  return rows.map(mapCardRow);
}

export async function getCatalogProductCards(): Promise<CatalogProductCard[]> {
  return selectCatalogProductCards({});
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

  return {
    ...product,
    media: mediaRows,
    variants: variantRows.map((variant) => ({
      ...variant,
      availableStock: Math.max(0, toNumber(variant.availableStock))
    }))
  };
}
