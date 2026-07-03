export type CheckoutStatus =
  | "draft"
  | "stock_reserved"
  | "payment_pending"
  | "payment_succeeded"
  | "payment_failed"
  | "expired"
  | "completed";

export interface CheckoutLine {
  skuId: string;
  quantity: number;
  unitPrice: number;
}
