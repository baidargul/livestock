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
