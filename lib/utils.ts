import { Animal } from "@prisma/client";

export function formalizeText(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function formatCurrency(amount: number, ignoreSymbol?: boolean) {
  const formattedNumber = new Intl.NumberFormat("en-US").format(amount);
  if (!ignoreSymbol) {
    return `Rs ${formattedNumber}`;
  } else {
    return `${formattedNumber}`;
  }
}

export function calculatePricing(animal: Animal) {
  const quantity =
    Number(animal.maleQuantityAvailable) +
    Number(animal.femaleQuantityAvailable);
  let priceString = "";
  let price = 0;
  let priceUnit = String(animal.priceUnit);
  if (
    priceUnit === `per ${animal.weightUnit}` ||
    priceUnit === `per ${animal.weightUnit}`
  ) {
    price = animal.price * Number(animal.averageWeight ?? 0);
    priceString = `Estimated weight: ${
      Number(animal.averageWeight ?? 0) * quantity
    } ${String(animal.weightUnit ?? "")
      .replace("per ", "")
      .toLowerCase()} - ${formatCurrency(price * Number(quantity))}.`;
    price = price * quantity;
  } else if (priceUnit === "per set") {
    price = animal.price;
    priceString = `Whole set at ${formatCurrency(price)}.`;
  } else if (priceUnit === "per piece") {
    price = animal.price * quantity;
    priceString = `${quantity} ${formalizeText(animal.breed)} ${
      animal.type
    } at ${formatCurrency(price)}.`;
  }

  return { price: price, text: priceString };
}
