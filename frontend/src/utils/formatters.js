export function formatCurrencyDisplay(amount, currencyCode) {
  const SYMBOL_MAP = {
    USD: "$",
    INR: "₹",
    EUR: "€",
  };

  // If currencyCode is undefined, lowercase, or unknown, symbol is undefined
  const symbol = SYMBOL_MAP[currencyCode];
  const safeSymbol = symbol ? symbol.toUpperCase() : (currencyCode || '$');
  return `${safeSymbol} ${Number(amount).toFixed(2)}`;
}
