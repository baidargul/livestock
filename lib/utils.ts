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
    Number(animal.maleQuantityAvailable || 0) +
    Number(animal.femaleQuantityAvailable || 0);

  const price = Number(animal.price || 0);
  const priceUnit = String(animal.priceUnit).toLowerCase();
  const weightUnit = String(animal.weightUnit).toLowerCase();
  const avgWeight = Number(animal.averageWeight || 0);

  let priceString = "";
  let totalPrice = 0;

  if (priceUnit === `per ${weightUnit}`) {
    const totalWeight = avgWeight * quantity;
    totalPrice = price * totalWeight;
    priceString = `${quantity} ${formalizeText(
      animal.type
    )} (${totalWeight}${weightUnit}) · ${formatCurrency(totalPrice)}`;
  } else if (priceUnit === "per set") {
    totalPrice = price;
    priceString = `${quantity} set${
      quantity !== 1 ? "s" : ""
    } · ${formatCurrency(totalPrice)}`;
  } else if (priceUnit === "per piece") {
    totalPrice = price * quantity;
    priceString = `${quantity} piece${
      quantity !== 1 ? "s" : ""
    } · ${formatCurrency(totalPrice)}`;
  } else {
    totalPrice = price;
    priceString = `Fixed price · ${formatCurrency(totalPrice)}`;
  }

  return {
    price: Math.round(totalPrice * 100) / 100, // Ensure 2 decimal places
    text: priceString,
    unit: priceUnit,
  };
}
