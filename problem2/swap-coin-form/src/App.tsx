import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SwapCard } from "@/components/SwapCard";
import { useEffect, useState } from "react";
import {
  SwapCoinBody,
  type SwapCoinBodyType,
} from "./schemaValidations/swap.schema";
import { fetchPrices, type PricesMap } from "./lib/tokenUtils";

export default function App() {
  const [prices, setPrices] = useState<PricesMap>({});
  const [tokens, setTokens] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [output, setOutput] = useState<string>("");
  const [totalFee, setTotalFee] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    setValue,
    watch,
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
        setValue("from", fromDefault, { shouldValidate: true });
        setValue("to", toDefault, { shouldValidate: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [setValue]);

  const from = watch("from");
  const to = watch("to");
  const inputAmount = watch("inputAmount");
  const feePct = watch("feePct");

  const priceFrom = prices[from];
  const priceTo = prices[to];
  const rate = priceFrom && priceTo ? priceFrom / priceTo : undefined;
  const eff = 1 - Math.max(0, feePct) / 100;

  // compute output
  useEffect(() => {
    const value = Number(inputAmount);
    if (rate && Number.isFinite(value) && value > 0) {
      const outputValue = value * eff * rate;
      const feeValue = (value * rate * Math.max(0, feePct)) / 100;
      setOutput(String(outputValue));
      setTotalFee(String(feeValue));
    } else {
      setOutput("");
      setTotalFee(undefined);
    }
  }, [inputAmount, eff, rate, feePct]);

  const rateText = rate ? `1 ${from} ≈ ${String(rate)} ${to}` : "";

  const onSubmit = async () => {
    setIsSubmitting(true);
    if (!rate || !isValid) return;
    await new Promise((r) => setTimeout(r, 1000)); // fake backend
    setIsSubmitting(false);
    alert("✅ Swap submitted!");
  };

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
        from={from}
        to={to}
        input={inputAmount}
        output={output}
        rateText={rateText}
        fee={feePct}
        onChangeFrom={(v) => {
          setValue("from", v);
          if (v === to) {
            const next = tokens.find((t) => t !== v) ?? v;
            setValue("to", next);
          }
        }}
        onChangeTo={(v) => setValue("to", v)}
        onChangeInput={(v) => setValue("inputAmount", v)}
        onSwapTokens={() => {
          const f = from;
          setValue("from", to);
          setValue("to", f);
        }}
        onChangeFee={(v) => setValue("feePct", v)}
        onConfirm={handleSubmit(onSubmit)}
        disabled={!isValid || !rate}
        isSubmitting={isSubmitting}
        totalFee={totalFee}
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
