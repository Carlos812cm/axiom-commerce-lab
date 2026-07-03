import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  type AnyPgColumn
} from "drizzle-orm/pg-core";

export const productStatusEnum = pgEnum("product_status", [
  "draft",
  "active",
  "archived"
]);

export const skuStatusEnum = pgEnum("sku_status", [
  "draft",
  "active",
  "discontinued"
]);

export const mediaKindEnum = pgEnum("media_kind", [
  "image",
  "video",
  "model_3d"
]);

export const mediaRoleEnum = pgEnum("media_role", [
  "hero",
  "gallery",
  "thumbnail",
  "detail",
  "lifestyle"
]);

export const specificationDataTypeEnum = pgEnum("specification_data_type", [
  "text",
  "number",
  "boolean",
  "json"
]);

export const priceStatusEnum = pgEnum("price_status", [
  "active",
  "scheduled",
  "expired",
  "disabled"
]);

export const reservationStatusEnum = pgEnum("reservation_status", [
  "active",
  "committed",
  "released",
  "expired"
]);

export const inventoryMovementTypeEnum = pgEnum("inventory_movement_type", [
  "purchase",
  "adjustment",
  "reservation",
  "release",
  "sale",
  "return"
]);

export const brands = pgTable(
  "brands",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    websiteUrl: text("website_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("brands_slug_idx").on(table.slug),
    index("brands_name_idx").on(table.name)
  ]
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    parentId: uuid("parent_id").references((): AnyPgColumn => categories.id),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("categories_slug_idx").on(table.slug),
    index("categories_parent_id_idx").on(table.parentId),
    index("categories_sort_order_idx").on(table.sortOrder)
  ]
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    brandId: uuid("brand_id")
      .notNull()
      .references(() => brands.id),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    description: text("description"),
    status: productStatusEnum("status").notNull().default("draft"),
    isFeatured: boolean("is_featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("products_slug_idx").on(table.slug),
    index("products_brand_id_idx").on(table.brandId),
    index("products_category_id_idx").on(table.categoryId),
    index("products_status_idx").on(table.status),
    index("products_is_featured_idx").on(table.isFeatured)
  ]
);

export const productVariants = pgTable(
  "product_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    colorName: text("color_name"),
    colorHex: text("color_hex"),
    sortOrder: integer("sort_order").notNull().default(0),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("product_variants_product_id_slug_idx").on(table.productId, table.slug),
    index("product_variants_product_id_idx").on(table.productId),
    index("product_variants_sort_order_idx").on(table.sortOrder)
  ]
);

export const skus = pgTable(
  "skus",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    variantId: uuid("variant_id")
      .notNull()
      .references(() => productVariants.id),
    code: text("code").notNull(),
    title: text("title").notNull(),
    barcode: text("barcode"),
    manufacturerPartNumber: text("manufacturer_part_number"),
    status: skuStatusEnum("status").notNull().default("draft"),
    attributes: jsonb("attributes")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("skus_code_idx").on(table.code),
    index("skus_variant_id_idx").on(table.variantId),
    index("skus_status_idx").on(table.status)
  ]
);

export const productMedia = pgTable(
  "product_media",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id),
    variantId: uuid("variant_id").references(() => productVariants.id),
    kind: mediaKindEnum("kind").notNull().default("image"),
    role: mediaRoleEnum("role").notNull().default("gallery"),
    url: text("url").notNull(),
    alt: text("alt").notNull(),
    width: integer("width"),
    height: integer("height"),
    sortOrder: integer("sort_order").notNull().default(0),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    index("product_media_product_id_idx").on(table.productId),
    index("product_media_variant_id_idx").on(table.variantId),
    index("product_media_role_idx").on(table.role),
    index("product_media_sort_order_idx").on(table.sortOrder)
  ]
);

export const specificationGroups = pgTable(
  "specification_groups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id),
    name: text("name").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("specification_groups_category_id_name_idx").on(table.categoryId, table.name),
    index("specification_groups_category_id_idx").on(table.categoryId),
    index("specification_groups_sort_order_idx").on(table.sortOrder)
  ]
);

export const specificationDefinitions = pgTable(
  "specification_definitions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id),
    groupId: uuid("group_id")
      .notNull()
      .references(() => specificationGroups.id),
    key: text("key").notNull(),
    label: text("label").notNull(),
    unit: text("unit"),
    dataType: specificationDataTypeEnum("data_type").notNull(),
    isFilterable: boolean("is_filterable").notNull().default(false),
    isComparable: boolean("is_comparable").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("specification_definitions_category_id_key_idx").on(table.categoryId, table.key),
    index("specification_definitions_category_id_idx").on(table.categoryId),
    index("specification_definitions_group_id_idx").on(table.groupId),
    index("specification_definitions_filterable_idx").on(table.isFilterable),
    index("specification_definitions_comparable_idx").on(table.isComparable)
  ]
);

export const skuSpecificationValues = pgTable(
  "sku_specification_values",
  {
    skuId: uuid("sku_id")
      .notNull()
      .references(() => skus.id),
    specificationDefinitionId: uuid("specification_definition_id")
      .notNull()
      .references(() => specificationDefinitions.id),
    valueText: text("value_text"),
    valueNumber: numeric("value_number", { precision: 12, scale: 4 }),
    valueBoolean: boolean("value_boolean"),
    valueJson: jsonb("value_json").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    primaryKey({
      columns: [table.skuId, table.specificationDefinitionId]
    }),
    index("sku_specification_values_sku_id_idx").on(table.skuId),
    index("sku_specification_values_definition_id_idx").on(table.specificationDefinitionId),
    index("sku_specification_values_value_number_idx").on(table.valueNumber),
    index("sku_specification_values_value_text_idx").on(table.valueText)
  ]
);

export const prices = pgTable(
  "prices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    skuId: uuid("sku_id")
      .notNull()
      .references(() => skus.id),
    currencyCode: text("currency_code").notNull().default("USD"),
    amountCents: integer("amount_cents").notNull(),
    compareAtCents: integer("compare_at_cents"),
    status: priceStatusEnum("status").notNull().default("active"),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    index("prices_sku_id_idx").on(table.skuId),
    index("prices_status_idx").on(table.status),
    index("prices_currency_code_idx").on(table.currencyCode),
    index("prices_lookup_idx").on(table.skuId, table.currencyCode, table.status)
  ]
);

export const warehouses = pgTable(
  "warehouses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: text("code").notNull(),
    name: text("name").notNull(),
    region: text("region"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("warehouses_code_idx").on(table.code),
    index("warehouses_region_idx").on(table.region)
  ]
);

export const inventoryItems = pgTable(
  "inventory_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    skuId: uuid("sku_id")
      .notNull()
      .references(() => skus.id),
    warehouseId: uuid("warehouse_id")
      .notNull()
      .references(() => warehouses.id),
    onHand: integer("on_hand").notNull().default(0),
    reserved: integer("reserved").notNull().default(0),
    safetyStock: integer("safety_stock").notNull().default(0),
    version: integer("version").notNull().default(1),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("inventory_items_sku_id_warehouse_id_idx").on(table.skuId, table.warehouseId),
    index("inventory_items_sku_id_idx").on(table.skuId),
    index("inventory_items_warehouse_id_idx").on(table.warehouseId)
  ]
);

export const stockReservations = pgTable(
  "stock_reservations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    checkoutSessionId: text("checkout_session_id").notNull(),
    skuId: uuid("sku_id")
      .notNull()
      .references(() => skus.id),
    warehouseId: uuid("warehouse_id")
      .notNull()
      .references(() => warehouses.id),
    quantity: integer("quantity").notNull(),
    status: reservationStatusEnum("status").notNull().default("active"),
    idempotencyKey: text("idempotency_key").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    uniqueIndex("stock_reservations_idempotency_key_idx").on(table.idempotencyKey),
    index("stock_reservations_checkout_session_id_idx").on(table.checkoutSessionId),
    index("stock_reservations_sku_id_idx").on(table.skuId),
    index("stock_reservations_warehouse_id_idx").on(table.warehouseId),
    index("stock_reservations_status_idx").on(table.status),
    index("stock_reservations_expires_at_idx").on(table.expiresAt)
  ]
);

export const inventoryMovements = pgTable(
  "inventory_movements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    skuId: uuid("sku_id")
      .notNull()
      .references(() => skus.id),
    warehouseId: uuid("warehouse_id")
      .notNull()
      .references(() => warehouses.id),
    reservationId: uuid("reservation_id").references(() => stockReservations.id),
    type: inventoryMovementTypeEnum("type").notNull(),
    quantityDelta: integer("quantity_delta").notNull(),
    reason: text("reason").notNull(),
    referenceType: text("reference_type"),
    referenceId: text("reference_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => [
    index("inventory_movements_sku_id_idx").on(table.skuId),
    index("inventory_movements_warehouse_id_idx").on(table.warehouseId),
    index("inventory_movements_reservation_id_idx").on(table.reservationId),
    index("inventory_movements_type_idx").on(table.type),
    index("inventory_movements_created_at_idx").on(table.createdAt)
  ]
);
