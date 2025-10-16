export const roundDecimal = (value: number, decimals: number): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

export const roundDecimalString = (value: number, decimals: number): string => {
  const factor = 10 ** decimals;
  const rounded = Math.round(value * factor) / factor;
  return rounded.toFixed(decimals).replace(/\.?0+$/, "");
};
