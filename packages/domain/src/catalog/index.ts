export type BrandId = string;
export type CategoryId = string;
export type ProductId = string;
export type VariantId = string;
export type SkuId = string;

export type ProductStatus = "draft" | "active" | "archived";
export type SkuStatus = "draft" | "active" | "discontinued";

export type SpecificationDataType = "text" | "number" | "boolean" | "json";

export interface BrandIdentity {
  id: BrandId;
  slug: string;
  name: string;
}

export interface CategoryIdentity {
  id: CategoryId;
  parentId: CategoryId | null;
  slug: string;
  name: string;
}

export interface ProductIdentity {
  id: ProductId;
  brandId: BrandId;
  categoryId: CategoryId;
  slug: string;
  title: string;
  subtitle: string | null;
  status: ProductStatus;
}

export interface ProductVariantIdentity {
  id: VariantId;
  productId: ProductId;
  slug: string;
  name: string;
  colorName: string | null;
  colorHex: string | null;
  isDefault: boolean;
}

export interface SkuIdentity {
  id: SkuId;
  variantId: VariantId;
  code: string;
  title: string;
  status: SkuStatus;
}

export interface SpecificationDefinition {
  key: string;
  label: string;
  unit: string | null;
  dataType: SpecificationDataType;
  isFilterable: boolean;
  isComparable: boolean;
}

export type SpecificationValue =
  | { type: "text"; value: string }
  | { type: "number"; value: number; unit: string | null }
  | { type: "boolean"; value: boolean }
  | { type: "json"; value: Record<string, unknown> };
