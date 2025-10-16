export type PricesMap = Record<string, number>;

const PRICES_URL = "https://interview.switcheo.com/prices.json";

export async function fetchPrices(): Promise<PricesMap> {
  const res = await fetch(PRICES_URL, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load prices");
  const data: Array<{ currency: string; price: number }> = await res.json();
  const map: PricesMap = {};
  for (const item of data) {
    if (item?.currency && Number.isFinite(item.price)) {
      map[item.currency.toUpperCase()] = item.price;
    }
  }
  return map;
}

export const iconUrl = (sym: string) =>
  `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${encodeURIComponent(
    sym.toUpperCase()
  )}.svg`;
