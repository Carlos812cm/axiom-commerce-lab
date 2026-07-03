export function formatCurrency(amountCents: number, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 0
  }).format(amountCents / 100);
}

export function getAvailabilityLabel(availableStock: number): string {
  if (availableStock <= 0) {
    return "Out of stock";
  }

  if (availableStock <= 5) {
    return "Low stock";
  }

  return "In stock";
}
