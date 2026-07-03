import type { SkuId } from "../catalog/index";

export type WarehouseId = string;

export type ReservationStatus = "active" | "committed" | "released" | "expired";

export interface InventorySnapshot {
  skuId: SkuId;
  warehouseId: WarehouseId;
  onHand: number;
  reserved: number;
  safetyStock: number;
}

export interface ReservationRequest {
  skuId: SkuId;
  warehouseId: WarehouseId;
  requestedQuantity: number;
}

export function calculateAvailableStock(snapshot: InventorySnapshot): number {
  return Math.max(0, snapshot.onHand - snapshot.reserved - snapshot.safetyStock);
}

export function canReserveStock(
  snapshot: InventorySnapshot,
  requestedQuantity: number
): boolean {
  if (!Number.isInteger(requestedQuantity) || requestedQuantity <= 0) {
    return false;
  }

  return calculateAvailableStock(snapshot) >= requestedQuantity;
}

export function assertReservableStock(
  snapshot: InventorySnapshot,
  requestedQuantity: number
): void {
  if (!canReserveStock(snapshot, requestedQuantity)) {
    throw new Error(
      `Insufficient stock for SKU ${snapshot.skuId}. Requested ${requestedQuantity}, available ${calculateAvailableStock(snapshot)}.`
    );
  }
}
