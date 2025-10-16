import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SwapCard } from "@/components/SwapCard";
import {
  SwapCoinBody,
  type SwapCoinBodyType,
} from "./schemaValidations/swap.schema";
import { fetchPrices, type PricesMap } from "./lib/tokenUtils";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";

const clamp = (x: number) => Math.min(Math.max(x, 0), 100);

export default function App() {
  const [prices, setPrices] = useState<PricesMap>({});
  const [tokens, setTokens] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    setValue,
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<SwapCoinBodyType>({
    mode: "onBlur",
    reValidateMode: "onBlur",
    resolver: zodResolver(SwapCoinBody),
    defaultValues: {
      from: "USDC",
      to: "ETH",
      inputAmount: "",
      feePct: 0.3,
    },
  });

  const from = useWatch({ control, name: "from" });
  const to = useWatch({ control, name: "to" });
  const feePct = useWatch({ control, name: "feePct" });

  const [inputRaw, setInputRaw] = useState("");
  const deferredInput = useDeferredValue(inputRaw);
  const [feeRaw, setFeeRaw] = useState<number>(feePct ?? 0.3);
  const deferredFee = useDeferredValue(feeRaw);

  // load prices
  useEffect(() => {
    (async () => {
      try {
        const map = await fetchPrices();
        const syms = Object.keys(map);
        setPrices(map);
        setTokens(syms);
        const fromDefault = syms.includes("USDC") ? "USDC" : syms[0];
        const toDefault = syms.find((s) => s !== fromDefault) ?? syms[1];
        setValue("from", fromDefault, { shouldValidate: false });
        setValue("to", toDefault, { shouldValidate: false });
      } finally {
        setLoading(false);
      }
    })();
  }, [setValue]);

  useEffect(() => {
    setValue("inputAmount", deferredInput, {
      shouldValidate: false,
      shouldDirty: true,
    });
  }, [deferredInput, setValue]);

  const priceFrom = prices[from ?? ""];
  const priceTo = prices[to ?? ""];
  const rate = useMemo(
    () => (priceFrom && priceTo ? priceFrom / priceTo : undefined),
    [priceFrom, priceTo]
  );

  const feeClamped = clamp(deferredFee ?? 0);
  const eff = useMemo(() => 1 - feeClamped / 100, [feeClamped]);

  const inputNum = useMemo(() => Number(deferredInput) || 0, [deferredInput]);

  const outputNum = useMemo(() => {
    if (!rate || !Number.isFinite(inputNum) || inputNum <= 0) return 0;
    return inputNum * eff * rate;
  }, [inputNum, eff, rate]);

  const totalFeeNum = useMemo(() => {
    if (!rate || !Number.isFinite(inputNum) || inputNum <= 0) return 0;
    return (inputNum * feeClamped) / 100;
  }, [inputNum, rate, feeClamped]);

  const output = outputNum > 0 ? String(outputNum) : "";
  const totalFee = totalFeeNum > 0 ? String(totalFeeNum) : undefined;

  const rateText = useMemo(
    () => (rate ? `1 ${from} ≈ ${String(rate)} ${to}` : ""),
    [rate, from, to]
  );

  const onChangeFrom = useCallback(
    (v: string) => {
      setValue("from", v, { shouldValidate: false });
      if (v === to) {
        const next = tokens.find((t) => t !== v) ?? v;
        setValue("to", next, { shouldValidate: false });
      }
    },
    [setValue, to, tokens]
  );

  const onChangeTo = useCallback(
    (v: string) => setValue("to", v, { shouldValidate: false }),
    [setValue]
  );

  const onChangeInput = useCallback((v: string) => {
    setInputRaw(v);
  }, []);

  const onSwapTokens = useCallback(() => {
    const f = from!;
    setValue("from", to!, { shouldValidate: false });
    setValue("to", f, { shouldValidate: false });
  }, [from, to, setValue]);

  const onSubmit = useCallback(async () => {
    if (!rate || !isValid) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    alert("✅ Swap submitted!");
  }, [rate, isValid]);

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center">
        <div className="rounded-2xl bg-card border-soft p-6">
          Fetching token prices…
        </div>
      </main>
    );
  }

  // common error
  const formError = errors.inputAmount?.message || errors.to?.message;

  return (
    <>
      <SwapCard
        tokens={tokens}
        from={from!}
        to={to!}
        input={inputRaw}
        output={output}
        rateText={rateText}
        fee={feeRaw}
        onChangeFrom={onChangeFrom}
        onChangeTo={onChangeTo}
        onChangeInput={onChangeInput}
        onSwapTokens={onSwapTokens}
        onChangeFeeRaw={setFeeRaw}
        onConfirm={handleSubmit(onSubmit)}
        disabled={!rate || !isValid}
        isSubmitting={isSubmitting}
        totalFee={totalFee}
        onCommitFee={(v) => setValue("feePct", v, { shouldValidate: false })}
      />

      {/* error common */}
      {formError && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-sm text-red-400 bg-black/30 px-3 py-2 rounded-lg border border-white/10">
          {formError}
        </div>
      )}
    </>
  );
}
