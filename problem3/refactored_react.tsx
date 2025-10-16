import React from "react";

interface WalletBalance {
  currency: string;
  amount: number;
  // FIX[1]: add require field because need to use balance.blockchain
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  priority: number;
}

type PricesMap = Record<string, number>;

// FIX[15][18]: use HTMLAttributes<HTMLDivElement> instead of BoxProps unknown
interface Props extends React.HTMLAttributes<HTMLDivElement> {}

// FIX[3][6][8]
const PRIORITY_MAP: Record<string, number> = {
  Osmosis: 5,
  Ethereum: 4,
  Arbitrum: 3,
  Zilliqa: 2,
  Neo: 1,
};
// FIX[2]
const getPriority = (blockchain: string): number =>
  PRIORITY_MAP[blockchain] ?? 0;

export const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances: FormattedWalletBalance[] = React.useMemo(() => {
    // FIX[4]
    // FIX[7]: remove 'prices' from deps
    // FIX[5]: filter amount > 0 instead of keep amount <= 0
    // FIX[8]: get priority once, do not call repeatedly in comparator
    const withPriority = balances
      .map<FormattedWalletBalance>((b) => ({
        ...b,
        priority: getPriority(b.blockchain),
        formatted: "", // temp formatted
      }))
      .filter((b) => b.priority >= 0 && b.amount > 0);

    withPriority.sort((a, b) => {
      if (a.priority > b.priority) return -1;
      if (a.priority < b.priority) return 1;
      return 0; // FIX[9]: handle when priority a = b
    });

    // FIX[10]
    for (const b of withPriority) {
      // FIX[11]: use toLocaleString instead of toFixed() with 0 decimals
      b.formatted = b.amount.toLocaleString(undefined, {
        maximumFractionDigits: 8,
      });
    }

    return withPriority;
  }, [balances]);

  const rows = React.useMemo(() => {
    return sortedBalances.map((b) => {
      // FIX[14]: price maybe undefined -> fallback 0
      const price = prices[b.currency] ?? 0;
      const usdValue = price * b.amount;

      // FIX[13]: use stable key instead of index; currency+blockchain is stable
      const key = `${b.currency}-${b.blockchain}`;

      return (
        <WalletRow
          key={key}
          amount={b.amount}
          usdValue={usdValue}
          // FIX[12]
          formattedAmount={b.formatted}
          // className={classes.row} // FIX[17]: just use when define classes
        />
      );
    });
  }, [sortedBalances, prices]);

  return (
    <div {...rest}>
      {rows}
      {children /* FIX[16]: render children */}
    </div>
  );
};
