import { db, closeDbConnection } from "./client";
import {
  brands,
  categories,
  inventoryItems,
  inventoryMovements,
  prices,
  productMedia,
  products,
  productVariants,
  skuSpecificationValues,
  skus,
  specificationDefinitions,
  specificationGroups,
  stockReservations,
  warehouses,
  type specificationDataTypeEnum
} from "./schema";

type SpecificationDataType = (typeof specificationDataTypeEnum.enumValues)[number];

type SpecificationSeedValue = string | number | boolean | Record<string, unknown>;

type SpecificationDefinitionSeed = {
  categorySlug: string;
  groupName: string;
  groupSortOrder: number;
  key: string;
  label: string;
  unit?: string | null;
  dataType: SpecificationDataType;
  isFilterable?: boolean;
  isComparable?: boolean;
  sortOrder: number;
};

type ProductFixture = {
  brandSlug: string;
  categorySlug: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  isFeatured: boolean;
  defaultVariant: {
    slug: string;
    name: string;
    colorName: string;
    colorHex: string;
    sku: {
      code: string;
      title: string;
      manufacturerPartNumber: string;
      attributes: Record<string, unknown>;
      priceAmountCents: number;
      inventoryByWarehouseCode: Record<string, { onHand: number; safetyStock: number }>;
      specs: Record<string, SpecificationSeedValue>;
    };
  };
};

function requireEntity<T>(value: T | undefined, label: string): T {
  if (!value) {
    throw new Error(`Missing required seed entity: ${label}`);
  }

  return value;
}

function mapBySlug<T extends { slug: string }>(rows: T[]): Map<string, T> {
  return new Map(rows.map((row) => [row.slug, row]));
}

function mapByCode<T extends { code: string }>(rows: T[]): Map<string, T> {
  return new Map(rows.map((row) => [row.code, row]));
}

async function resetDatabase(): Promise<void> {
  await db.delete(inventoryMovements);
  await db.delete(stockReservations);
  await db.delete(inventoryItems);
  await db.delete(prices);
  await db.delete(skuSpecificationValues);
  await db.delete(productMedia);
  await db.delete(skus);
  await db.delete(productVariants);
  await db.delete(specificationDefinitions);
  await db.delete(specificationGroups);
  await db.delete(products);
  await db.delete(categories);
  await db.delete(brands);
  await db.delete(warehouses);
}

const brandSeeds = [
  {
    slug: "arc",
    name: "Arc",
    description: "Flagship mobile technology with precision hardware and computational imaging."
  },
  {
    slug: "nomad",
    name: "Nomad",
    description: "Portable workstations for creators, engineers and operators."
  },
  {
    slug: "aura",
    name: "Aura",
    description: "Immersive audio products with refined industrial design."
  },
  {
    slug: "prism",
    name: "Prism",
    description: "Tablets and displays for mobile creativity."
  },
  {
    slug: "nova",
    name: "Nova",
    description: "Gaming hardware with high-refresh performance."
  },
  {
    slug: "pulse",
    name: "Pulse",
    description: "Wearables for health, endurance and connected mobility."
  },
  {
    slug: "homecore",
    name: "HomeCore",
    description: "Smart home devices for connected spaces."
  },
  {
    slug: "keystone",
    name: "Keystone",
    description: "Premium productivity accessories and desktop expansion."
  }
];

const categorySeeds = [
  {
    slug: "smartphones",
    name: "Smartphones",
    description: "Flagship and premium mobile devices.",
    sortOrder: 10
  },
  {
    slug: "laptops",
    name: "Laptops",
    description: "Portable computers for productivity, engineering and creative workloads.",
    sortOrder: 20
  },
  {
    slug: "tablets",
    name: "Tablets",
    description: "Touch-first devices for creativity, media and productivity.",
    sortOrder: 30
  },
  {
    slug: "audio",
    name: "Audio",
    description: "Headphones, earbuds and immersive audio systems.",
    sortOrder: 40
  },
  {
    slug: "gaming",
    name: "Gaming",
    description: "Consoles, handhelds and high-performance gaming hardware.",
    sortOrder: 50
  },
  {
    slug: "wearables",
    name: "Wearables",
    description: "Connected watches and personal devices.",
    sortOrder: 60
  },
  {
    slug: "smart-home",
    name: "Smart Home",
    description: "Connected hubs, sensors and automation devices.",
    sortOrder: 70
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "Premium docks, chargers, keyboards and expansion gear.",
    sortOrder: 80
  }
];

const warehouseSeeds = [
  {
    code: "CDMX",
    name: "Mexico City Fulfillment Center",
    region: "Central Mexico"
  },
  {
    code: "MTY",
    name: "Monterrey Fulfillment Center",
    region: "Northern Mexico"
  }
];

const specificationSeeds: SpecificationDefinitionSeed[] = [
  {
    categorySlug: "smartphones",
    groupName: "Performance",
    groupSortOrder: 10,
    key: "ram_gb",
    label: "RAM",
    unit: "GB",
    dataType: "number",
    isFilterable: true,
    sortOrder: 10
  },
  {
    categorySlug: "smartphones",
    groupName: "Storage",
    groupSortOrder: 20,
    key: "storage_gb",
    label: "Storage",
    unit: "GB",
    dataType: "number",
    isFilterable: true,
    sortOrder: 20
  },
  {
    categorySlug: "smartphones",
    groupName: "Display",
    groupSortOrder: 30,
    key: "display_inches",
    label: "Display",
    unit: "in",
    dataType: "number",
    isFilterable: true,
    sortOrder: 30
  },
  {
    categorySlug: "smartphones",
    groupName: "Display",
    groupSortOrder: 30,
    key: "refresh_rate_hz",
    label: "Refresh rate",
    unit: "Hz",
    dataType: "number",
    isFilterable: true,
    sortOrder: 40
  },
  {
    categorySlug: "smartphones",
    groupName: "Camera",
    groupSortOrder: 40,
    key: "camera_mp",
    label: "Main camera",
    unit: "MP",
    dataType: "number",
    isFilterable: true,
    sortOrder: 50
  },
  {
    categorySlug: "smartphones",
    groupName: "Battery",
    groupSortOrder: 50,
    key: "battery_mah",
    label: "Battery",
    unit: "mAh",
    dataType: "number",
    isFilterable: true,
    sortOrder: 60
  },
  {
    categorySlug: "smartphones",
    groupName: "Connectivity",
    groupSortOrder: 60,
    key: "cellular",
    label: "Cellular",
    dataType: "text",
    isFilterable: true,
    sortOrder: 70
  },

  {
    categorySlug: "laptops",
    groupName: "Performance",
    groupSortOrder: 10,
    key: "ram_gb",
    label: "RAM",
    unit: "GB",
    dataType: "number",
    isFilterable: true,
    sortOrder: 10
  },
  {
    categorySlug: "laptops",
    groupName: "Storage",
    groupSortOrder: 20,
    key: "storage_gb",
    label: "Storage",
    unit: "GB",
    dataType: "number",
    isFilterable: true,
    sortOrder: 20
  },
  {
    categorySlug: "laptops",
    groupName: "Performance",
    groupSortOrder: 10,
    key: "processor",
    label: "Processor",
    dataType: "text",
    isFilterable: true,
    sortOrder: 30
  },
  {
    categorySlug: "laptops",
    groupName: "Display",
    groupSortOrder: 30,
    key: "display_inches",
    label: "Display",
    unit: "in",
    dataType: "number",
    isFilterable: true,
    sortOrder: 40
  },
  {
    categorySlug: "laptops",
    groupName: "Display",
    groupSortOrder: 30,
    key: "refresh_rate_hz",
    label: "Refresh rate",
    unit: "Hz",
    dataType: "number",
    isFilterable: true,
    sortOrder: 50
  },
  {
    categorySlug: "laptops",
    groupName: "Graphics",
    groupSortOrder: 40,
    key: "gpu",
    label: "GPU",
    dataType: "text",
    isFilterable: true,
    sortOrder: 60
  },
  {
    categorySlug: "laptops",
    groupName: "Physical",
    groupSortOrder: 50,
    key: "weight_kg",
    label: "Weight",
    unit: "kg",
    dataType: "number",
    isFilterable: true,
    sortOrder: 70
  },
  {
    categorySlug: "laptops",
    groupName: "Usage",
    groupSortOrder: 60,
    key: "usage",
    label: "Recommended use",
    dataType: "text",
    isFilterable: true,
    sortOrder: 80
  },

  {
    categorySlug: "tablets",
    groupName: "Storage",
    groupSortOrder: 10,
    key: "storage_gb",
    label: "Storage",
    unit: "GB",
    dataType: "number",
    isFilterable: true,
    sortOrder: 10
  },
  {
    categorySlug: "tablets",
    groupName: "Display",
    groupSortOrder: 20,
    key: "display_inches",
    label: "Display",
    unit: "in",
    dataType: "number",
    isFilterable: true,
    sortOrder: 20
  },
  {
    categorySlug: "tablets",
    groupName: "Display",
    groupSortOrder: 20,
    key: "refresh_rate_hz",
    label: "Refresh rate",
    unit: "Hz",
    dataType: "number",
    isFilterable: true,
    sortOrder: 30
  },
  {
    categorySlug: "tablets",
    groupName: "Battery",
    groupSortOrder: 30,
    key: "battery_mah",
    label: "Battery",
    unit: "mAh",
    dataType: "number",
    isFilterable: true,
    sortOrder: 40
  },
  {
    categorySlug: "tablets",
    groupName: "Accessories",
    groupSortOrder: 40,
    key: "pencil_support",
    label: "Pencil support",
    dataType: "boolean",
    isFilterable: true,
    sortOrder: 50
  },
  {
    categorySlug: "tablets",
    groupName: "Accessories",
    groupSortOrder: 40,
    key: "keyboard_support",
    label: "Keyboard support",
    dataType: "boolean",
    isFilterable: true,
    sortOrder: 60
  },

  {
    categorySlug: "audio",
    groupName: "Audio",
    groupSortOrder: 10,
    key: "form_factor",
    label: "Form factor",
    dataType: "text",
    isFilterable: true,
    sortOrder: 10
  },
  {
    categorySlug: "audio",
    groupName: "Audio",
    groupSortOrder: 10,
    key: "anc",
    label: "Active noise cancellation",
    dataType: "boolean",
    isFilterable: true,
    sortOrder: 20
  },
  {
    categorySlug: "audio",
    groupName: "Battery",
    groupSortOrder: 20,
    key: "battery_hours",
    label: "Battery life",
    unit: "hours",
    dataType: "number",
    isFilterable: true,
    sortOrder: 30
  },
  {
    categorySlug: "audio",
    groupName: "Wireless",
    groupSortOrder: 30,
    key: "codec",
    label: "Codec",
    dataType: "text",
    isFilterable: true,
    sortOrder: 40
  },
  {
    categorySlug: "audio",
    groupName: "Durability",
    groupSortOrder: 40,
    key: "water_resistance",
    label: "Water resistance",
    dataType: "text",
    isFilterable: true,
    sortOrder: 50
  },

  {
    categorySlug: "gaming",
    groupName: "Performance",
    groupSortOrder: 10,
    key: "storage_gb",
    label: "Storage",
    unit: "GB",
    dataType: "number",
    isFilterable: true,
    sortOrder: 10
  },
  {
    categorySlug: "gaming",
    groupName: "Display",
    groupSortOrder: 20,
    key: "resolution",
    label: "Resolution",
    dataType: "text",
    isFilterable: true,
    sortOrder: 20
  },
  {
    categorySlug: "gaming",
    groupName: "Display",
    groupSortOrder: 20,
    key: "refresh_rate_hz",
    label: "Refresh rate",
    unit: "Hz",
    dataType: "number",
    isFilterable: true,
    sortOrder: 30
  },
  {
    categorySlug: "gaming",
    groupName: "Graphics",
    groupSortOrder: 30,
    key: "gpu",
    label: "GPU",
    dataType: "text",
    isFilterable: true,
    sortOrder: 40
  },
  {
    categorySlug: "gaming",
    groupName: "Graphics",
    groupSortOrder: 30,
    key: "ray_tracing",
    label: "Ray tracing",
    dataType: "boolean",
    isFilterable: true,
    sortOrder: 50
  },

  {
    categorySlug: "wearables",
    groupName: "Display",
    groupSortOrder: 10,
    key: "display_inches",
    label: "Display",
    unit: "in",
    dataType: "number",
    isFilterable: true,
    sortOrder: 10
  },
  {
    categorySlug: "wearables",
    groupName: "Battery",
    groupSortOrder: 20,
    key: "battery_hours",
    label: "Battery life",
    unit: "hours",
    dataType: "number",
    isFilterable: true,
    sortOrder: 20
  },
  {
    categorySlug: "wearables",
    groupName: "Durability",
    groupSortOrder: 30,
    key: "water_resistance",
    label: "Water resistance",
    dataType: "text",
    isFilterable: true,
    sortOrder: 30
  },
  {
    categorySlug: "wearables",
    groupName: "Connectivity",
    groupSortOrder: 40,
    key: "cellular",
    label: "Cellular",
    dataType: "text",
    isFilterable: true,
    sortOrder: 40
  },

  {
    categorySlug: "smart-home",
    groupName: "Connectivity",
    groupSortOrder: 10,
    key: "matter_support",
    label: "Matter support",
    dataType: "boolean",
    isFilterable: true,
    sortOrder: 10
  },
  {
    categorySlug: "smart-home",
    groupName: "Connectivity",
    groupSortOrder: 10,
    key: "thread_support",
    label: "Thread support",
    dataType: "boolean",
    isFilterable: true,
    sortOrder: 20
  },
  {
    categorySlug: "smart-home",
    groupName: "Audio",
    groupSortOrder: 20,
    key: "speaker_power_w",
    label: "Speaker power",
    unit: "W",
    dataType: "number",
    isFilterable: true,
    sortOrder: 30
  },

  {
    categorySlug: "accessories",
    groupName: "Expansion",
    groupSortOrder: 10,
    key: "ports",
    label: "Ports",
    dataType: "number",
    isFilterable: true,
    sortOrder: 10
  },
  {
    categorySlug: "accessories",
    groupName: "Power",
    groupSortOrder: 20,
    key: "power_delivery_w",
    label: "Power delivery",
    unit: "W",
    dataType: "number",
    isFilterable: true,
    sortOrder: 20
  },
  {
    categorySlug: "accessories",
    groupName: "Display",
    groupSortOrder: 30,
    key: "display_outputs",
    label: "Display outputs",
    dataType: "number",
    isFilterable: true,
    sortOrder: 30
  }
];

const productFixtures: ProductFixture[] = [
  {
    brandSlug: "arc",
    categorySlug: "smartphones",
    slug: "arc-phone-pro",
    title: "Arc Phone Pro",
    subtitle: "Titanium flagship with adaptive imaging.",
    description:
      "A flagship smartphone built for computational photography, high-refresh interaction and all-day performance.",
    isFeatured: true,
    defaultVariant: {
      slug: "titanium-black",
      name: "Titanium Black",
      colorName: "Titanium Black",
      colorHex: "#111827",
      sku: {
        code: "ARC-PHONE-PRO-TB-256",
        title: "Arc Phone Pro 256GB Titanium Black",
        manufacturerPartNumber: "ARC-PRO-256-TB",
        attributes: { storageGb: 256, ramGb: 12 },
        priceAmountCents: 99900,
        inventoryByWarehouseCode: {
          CDMX: { onHand: 18, safetyStock: 2 },
          MTY: { onHand: 7, safetyStock: 1 }
        },
        specs: {
          ram_gb: 12,
          storage_gb: 256,
          display_inches: 6.7,
          refresh_rate_hz: 120,
          camera_mp: 48,
          battery_mah: 4800,
          cellular: "5G"
        }
      }
    }
  },
  {
    brandSlug: "nomad",
    categorySlug: "laptops",
    slug: "nomadbook-14",
    title: "NomadBook 14",
    subtitle: "Ultra-light workstation for mobile creation.",
    description:
      "A portable workstation with a studio-grade display, neural acceleration and thermal headroom for serious work.",
    isFeatured: true,
    defaultVariant: {
      slug: "graphite",
      name: "Graphite",
      colorName: "Graphite",
      colorHex: "#262626",
      sku: {
        code: "NOMADBOOK14-GR-32-1TB",
        title: "NomadBook 14 Graphite 32GB 1TB",
        manufacturerPartNumber: "NB14-GR-32-1TB",
        attributes: { ramGb: 32, storageGb: 1024 },
        priceAmountCents: 169900,
        inventoryByWarehouseCode: {
          CDMX: { onHand: 8, safetyStock: 1 },
          MTY: { onHand: 4, safetyStock: 1 }
        },
        specs: {
          ram_gb: 32,
          storage_gb: 1024,
          processor: "X-Series Pro",
          display_inches: 14.2,
          refresh_rate_hz: 120,
          gpu: "Integrated Neural GPU",
          weight_kg: 1.28,
          usage: "Creator"
        }
      }
    }
  },
  {
    brandSlug: "aura",
    categorySlug: "audio",
    slug: "aura-max",
    title: "Aura Max",
    subtitle: "Adaptive noise control with lossless-ready wireless.",
    description:
      "Over-ear wireless headphones with adaptive cancellation, long battery life and premium acoustic tuning.",
    isFeatured: true,
    defaultVariant: {
      slug: "midnight",
      name: "Midnight",
      colorName: "Midnight",
      colorHex: "#020617",
      sku: {
        code: "AURA-MAX-MIDNIGHT",
        title: "Aura Max Midnight",
        manufacturerPartNumber: "AURA-MAX-MDN",
        attributes: { formFactor: "over-ear" },
        priceAmountCents: 39900,
        inventoryByWarehouseCode: {
          CDMX: { onHand: 24, safetyStock: 3 },
          MTY: { onHand: 12, safetyStock: 2 }
        },
        specs: {
          form_factor: "Over-ear",
          anc: true,
          battery_hours: 36,
          codec: "LDAC",
          water_resistance: "IPX4"
        }
      }
    }
  },
  {
    brandSlug: "prism",
    categorySlug: "tablets",
    slug: "prism-tab-11",
    title: "Prism Tab 11",
    subtitle: "Thin tablet with creative input support.",
    description:
      "A high-resolution tablet for sketching, editing, note-taking and lightweight productivity.",
    isFeatured: false,
    defaultVariant: {
      slug: "silver",
      name: "Silver",
      colorName: "Silver",
      colorHex: "#d4d4d8",
      sku: {
        code: "PRISM-TAB11-SV-256",
        title: "Prism Tab 11 Silver 256GB",
        manufacturerPartNumber: "PT11-SV-256",
        attributes: { storageGb: 256 },
        priceAmountCents: 69900,
        inventoryByWarehouseCode: {
          CDMX: { onHand: 14, safetyStock: 2 },
          MTY: { onHand: 6, safetyStock: 1 }
        },
        specs: {
          storage_gb: 256,
          display_inches: 11,
          refresh_rate_hz: 120,
          battery_mah: 8200,
          pencil_support: true,
          keyboard_support: true
        }
      }
    }
  },
  {
    brandSlug: "nova",
    categorySlug: "gaming",
    slug: "nova-console-x",
    title: "Nova Console X",
    subtitle: "High-refresh living room gaming system.",
    description:
      "A compact gaming console engineered for fast loading, high-refresh gameplay and cinematic rendering.",
    isFeatured: false,
    defaultVariant: {
      slug: "onyx",
      name: "Onyx",
      colorName: "Onyx",
      colorHex: "#09090b",
      sku: {
        code: "NOVA-CONSOLE-X-1TB",
        title: "Nova Console X 1TB",
        manufacturerPartNumber: "NCX-1TB",
        attributes: { storageGb: 1024 },
        priceAmountCents: 54900,
        inventoryByWarehouseCode: {
          CDMX: { onHand: 10, safetyStock: 2 },
          MTY: { onHand: 5, safetyStock: 1 }
        },
        specs: {
          storage_gb: 1024,
          resolution: "4K",
          refresh_rate_hz: 120,
          gpu: "Nova RDNA-X",
          ray_tracing: true
        }
      }
    }
  },
  {
    brandSlug: "pulse",
    categorySlug: "wearables",
    slug: "pulse-watch-ultra",
    title: "Pulse Watch Ultra",
    subtitle: "Rugged connected watch for endurance tracking.",
    description:
      "A durable smartwatch with advanced health metrics, LTE connectivity and multi-day endurance.",
    isFeatured: false,
    defaultVariant: {
      slug: "titanium",
      name: "Titanium",
      colorName: "Titanium",
      colorHex: "#a1a1aa",
      sku: {
        code: "PULSE-WATCH-ULTRA-TI",
        title: "Pulse Watch Ultra Titanium",
        manufacturerPartNumber: "PWU-TI",
        attributes: { cellular: true },
        priceAmountCents: 79900,
        inventoryByWarehouseCode: {
          CDMX: { onHand: 9, safetyStock: 1 },
          MTY: { onHand: 3, safetyStock: 1 }
        },
        specs: {
          display_inches: 1.9,
          battery_hours: 72,
          water_resistance: "100m",
          cellular: "LTE"
        }
      }
    }
  },
  {
    brandSlug: "homecore",
    categorySlug: "smart-home",
    slug: "homecore-hub",
    title: "HomeCore Hub",
    subtitle: "Matter-ready control surface for connected spaces.",
    description:
      "A compact smart home hub with local automation, speaker integration and modern protocol support.",
    isFeatured: false,
    defaultVariant: {
      slug: "soft-white",
      name: "Soft White",
      colorName: "Soft White",
      colorHex: "#f8fafc",
      sku: {
        code: "HOMECORE-HUB-WHT",
        title: "HomeCore Hub Soft White",
        manufacturerPartNumber: "HCH-WHT",
        attributes: { matter: true, thread: true },
        priceAmountCents: 14900,
        inventoryByWarehouseCode: {
          CDMX: { onHand: 30, safetyStock: 4 },
          MTY: { onHand: 16, safetyStock: 2 }
        },
        specs: {
          matter_support: true,
          thread_support: true,
          speaker_power_w: 18
        }
      }
    }
  },
  {
    brandSlug: "keystone",
    categorySlug: "accessories",
    slug: "keystone-dock-pro",
    title: "Keystone Dock Pro",
    subtitle: "Desktop expansion dock for power users.",
    description:
      "A premium aluminum dock with high-wattage power delivery, multi-display support and workstation-class connectivity.",
    isFeatured: false,
    defaultVariant: {
      slug: "space-gray",
      name: "Space Gray",
      colorName: "Space Gray",
      colorHex: "#3f3f46",
      sku: {
        code: "KEYSTONE-DOCK-PRO-SG",
        title: "Keystone Dock Pro Space Gray",
        manufacturerPartNumber: "KDP-SG",
        attributes: { ports: 12, powerDeliveryW: 140 },
        priceAmountCents: 29900,
        inventoryByWarehouseCode: {
          CDMX: { onHand: 20, safetyStock: 2 },
          MTY: { onHand: 10, safetyStock: 1 }
        },
        specs: {
          ports: 12,
          power_delivery_w: 140,
          display_outputs: 3
        }
      }
    }
  }
];

async function seed(): Promise<void> {
  console.info("Resetting demo database...");
  await resetDatabase();

  console.info("Seeding brands...");
  const insertedBrands = await db.insert(brands).values(brandSeeds).returning();
  const brandBySlug = mapBySlug(insertedBrands);

  console.info("Seeding categories...");
  const insertedCategories = await db.insert(categories).values(categorySeeds).returning();
  const categoryBySlug = mapBySlug(insertedCategories);

  console.info("Seeding warehouses...");
  const insertedWarehouses = await db.insert(warehouses).values(warehouseSeeds).returning();
  const warehouseByCode = mapByCode(insertedWarehouses);

  console.info("Seeding specification definitions...");
  const specificationDefinitionByCategoryAndKey = new Map<
    string,
    typeof specificationDefinitions.$inferSelect
  >();

  const specificationGroupByCategoryAndName = new Map<
    string,
    typeof specificationGroups.$inferSelect
  >();

  for (const specSeed of specificationSeeds) {
    const category = requireEntity(
      categoryBySlug.get(specSeed.categorySlug),
      `category ${specSeed.categorySlug}`
    );

    const groupKey = `${specSeed.categorySlug}:${specSeed.groupName}`;
    let group = specificationGroupByCategoryAndName.get(groupKey);

    if (!group) {
      const [insertedGroup] = await db
        .insert(specificationGroups)
        .values({
          categoryId: category.id,
          name: specSeed.groupName,
          sortOrder: specSeed.groupSortOrder
        })
        .returning();

      group = requireEntity(insertedGroup, `specification group ${groupKey}`);
      specificationGroupByCategoryAndName.set(groupKey, group);
    }

    const [definition] = await db
      .insert(specificationDefinitions)
      .values({
        categoryId: category.id,
        groupId: group.id,
        key: specSeed.key,
        label: specSeed.label,
        unit: specSeed.unit ?? null,
        dataType: specSeed.dataType,
        isFilterable: specSeed.isFilterable ?? false,
        isComparable: specSeed.isComparable ?? true,
        sortOrder: specSeed.sortOrder
      })
      .returning();

    specificationDefinitionByCategoryAndKey.set(
      `${specSeed.categorySlug}:${specSeed.key}`,
      requireEntity(definition, `specification definition ${specSeed.key}`)
    );
  }

  console.info("Seeding products, variants, SKUs, media, prices, specs and inventory...");

  for (const fixture of productFixtures) {
    const brand = requireEntity(brandBySlug.get(fixture.brandSlug), `brand ${fixture.brandSlug}`);
    const category = requireEntity(
      categoryBySlug.get(fixture.categorySlug),
      `category ${fixture.categorySlug}`
    );

    const [product] = await db
      .insert(products)
      .values({
        brandId: brand.id,
        categoryId: category.id,
        slug: fixture.slug,
        title: fixture.title,
        subtitle: fixture.subtitle,
        description: fixture.description,
        status: "active",
        isFeatured: fixture.isFeatured
      })
      .returning();

    const insertedProduct = requireEntity(product, `product ${fixture.slug}`);

    const [variant] = await db
      .insert(productVariants)
      .values({
        productId: insertedProduct.id,
        slug: fixture.defaultVariant.slug,
        name: fixture.defaultVariant.name,
        colorName: fixture.defaultVariant.colorName,
        colorHex: fixture.defaultVariant.colorHex,
        isDefault: true,
        sortOrder: 10
      })
      .returning();

    const insertedVariant = requireEntity(variant, `variant ${fixture.defaultVariant.slug}`);

    const [sku] = await db
      .insert(skus)
      .values({
        variantId: insertedVariant.id,
        code: fixture.defaultVariant.sku.code,
        title: fixture.defaultVariant.sku.title,
        manufacturerPartNumber: fixture.defaultVariant.sku.manufacturerPartNumber,
        status: "active",
        attributes: fixture.defaultVariant.sku.attributes
      })
      .returning();

    const insertedSku = requireEntity(sku, `sku ${fixture.defaultVariant.sku.code}`);

    await db.insert(productMedia).values({
      productId: insertedProduct.id,
      variantId: insertedVariant.id,
      kind: "image",
      role: "hero",
      url: `/demo-media/${fixture.slug}.webp`,
      alt: `${fixture.title} hero render`,
      width: 1600,
      height: 1200,
      sortOrder: 10,
      metadata: {
        placeholder: true,
        tone: fixture.defaultVariant.colorName
      }
    });

    await db.insert(prices).values({
      skuId: insertedSku.id,
      currencyCode: "USD",
      amountCents: fixture.defaultVariant.sku.priceAmountCents,
      status: "active"
    });

    const specRows: (typeof skuSpecificationValues.$inferInsert)[] = [];

    for (const [specKey, specValue] of Object.entries(fixture.defaultVariant.sku.specs)) {
      const definition = requireEntity(
        specificationDefinitionByCategoryAndKey.get(`${fixture.categorySlug}:${specKey}`),
        `specification ${fixture.categorySlug}:${specKey}`
      );

      const row: typeof skuSpecificationValues.$inferInsert = {
        skuId: insertedSku.id,
        specificationDefinitionId: definition.id
      };

      if (definition.dataType === "text") {
        if (typeof specValue !== "string") {
          throw new Error(`Specification ${specKey} expects text`);
        }

        row.valueText = specValue;
      }

      if (definition.dataType === "number") {
        if (typeof specValue !== "number") {
          throw new Error(`Specification ${specKey} expects number`);
        }

        row.valueNumber = String(specValue);
      }

      if (definition.dataType === "boolean") {
        if (typeof specValue !== "boolean") {
          throw new Error(`Specification ${specKey} expects boolean`);
        }

        row.valueBoolean = specValue;
      }

      if (definition.dataType === "json") {
        if (typeof specValue !== "object" || specValue === null || Array.isArray(specValue)) {
          throw new Error(`Specification ${specKey} expects JSON object`);
        }

        row.valueJson = specValue;
      }

      specRows.push(row);
    }

    if (specRows.length > 0) {
      await db.insert(skuSpecificationValues).values(specRows);
    }

    for (const [warehouseCode, inventorySeed] of Object.entries(
      fixture.defaultVariant.sku.inventoryByWarehouseCode
    )) {
      const warehouse = requireEntity(
        warehouseByCode.get(warehouseCode),
        `warehouse ${warehouseCode}`
      );

      await db.insert(inventoryItems).values({
        skuId: insertedSku.id,
        warehouseId: warehouse.id,
        onHand: inventorySeed.onHand,
        reserved: 0,
        safetyStock: inventorySeed.safetyStock
      });
    }
  }

  console.info("Seed completed.");
}

seed()
  .then(async () => {
    await closeDbConnection();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await closeDbConnection();
    process.exit(1);
  });
