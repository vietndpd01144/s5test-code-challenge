interface WalletBalance {
  currency: string;
  amount: number;
  // [1] WalletBalance lacks blockchain, but code uses balance.blockchain.
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// [15] BoxProps unknown
interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  // [16] Get children from props but not render below
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // [2] getPriority(blockchain: any) uses any type → loses type safety and IntelliSense
  // [3] getPriority in render scope.
  const getPriority = (blockchain: any): number => {
    // [6] The priority numbers of the items do not need to be that far apart.
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        // [1] balance.blockchain not exist in interface
        // [8] getPriority function be call many time in .sort() comparator
        const balancePriority = getPriority(balance.blockchain);
        // [4] lhsPriority not be define before use
        if (lhsPriority > -99) {
          // [5] logic of sortedBalances is conflict
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        // [1] balance.blockchain not exist in interface
        // [8] getPriority function be call many time in .sort() comparator
        const leftPriority = getPriority(lhs.blockchain);
        // [1] balance.blockchain not exist in interface
        // [8] getPriority function be call many time in .sort() comparator
        const rightPriority = getPriority(rhs.blockchain);
        // [9] Comparator missing branch else to returns 0 when equal (not wrong but less clear).
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
    // [7] sortedBalances depends on prices in useMemo even though prices are not used
  }, [balances, prices]);

  // [10] formattedBalances are created but not used anywhere
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      // [11] use .toFixed() but does not pass decimal numbers
      formatted: balance.amount.toFixed(),
    };
  });

  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      // [14] Can be NaN when prices[currency] = undefined
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        // [12] wrong type: sortedBalances have WalletBalance type, not FormattedWalletBalance
        <WalletRow
          // [17] classes.row not been define yet
          className={classes.row}
          // [13] key={index} in .map() -> key is unstable when order/sort
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          // [12] formatted not have in WalletBalance
          formattedAmount={balance.formatted}
        />
      );
    }
  );
  // [18] Spread ...rest into <div> can push strange props (from BoxProps) down to DOM
  return <div {...rest}>{rows}</div>;
};
