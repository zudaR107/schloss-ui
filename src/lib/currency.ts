const symbolCache = new Map<string, string>()

/** 'RUB' -> '₽', 'USD' -> '$', ... via Intl's own currency-symbol table,
 * so a typed amount's prefix always matches what display formatting
 * (Intl.NumberFormat with style:'currency') shows for the same code
 * elsewhere. Falls back to the raw code for anything Intl doesn't
 * recognize (e.g. a currency field mid-edit, not yet a valid ISO code). */
export function currencySymbol(currencyCode: string): string {
  const cached = symbolCache.get(currencyCode)
  if (cached) return cached

  let symbol = currencyCode
  try {
    const parts = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: currencyCode }).formatToParts(0)
    symbol = parts.find((p) => p.type === 'currency')?.value ?? currencyCode
  } catch {
    // Invalid/incomplete ISO code - keep the fallback.
  }

  symbolCache.set(currencyCode, symbol)
  return symbol
}
