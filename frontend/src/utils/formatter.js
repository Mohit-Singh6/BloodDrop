export function formatCurrencyDisplay(amount, currencyCode) {
  const SYMBOL_MAP = {
    USD: "$",
    INR: "₹",
    EUR: "€",
  };

  // If currencyCode is undefined, lowercase, or unknown, symbol is undefined
  const symbol = SYMBOL_MAP[currencyCode];
  return `${symbol.toUpperCase()} ${Number(amount).toFixed(2)}`;
}