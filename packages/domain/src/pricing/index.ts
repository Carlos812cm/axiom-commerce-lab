export type CurrencyCode = "USD" | "MXN";

export interface Money {
  amountCents: number;
  currencyCode: CurrencyCode;
}

export interface PriceBreakdown {
  subtotal: Money;
  discountTotal: Money;
  taxTotal: Money;
  shippingTotal: Money;
  grandTotal: Money;
}

export function createMoney(amountCents: number, currencyCode: CurrencyCode): Money {
  if (!Number.isInteger(amountCents)) {
    throw new Error("Money amount must be represented in integer cents");
  }

  if (amountCents < 0) {
    throw new Error("Money amount cannot be negative");
  }

  return {
    amountCents,
    currencyCode
  };
}

export function addMoney(left: Money, right: Money): Money {
  if (left.currencyCode !== right.currencyCode) {
    throw new Error("Cannot add money with different currencies");
  }

  return createMoney(left.amountCents + right.amountCents, left.currencyCode);
}

export function multiplyMoney(money: Money, quantity: number): Money {
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new Error("Quantity must be a non-negative integer");
  }

  return createMoney(money.amountCents * quantity, money.currencyCode);
}
