import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { ArrowUpDown, Loader2, Settings } from "lucide-react";
import { iconUrl } from "@/lib/tokenUtils";
import { cn } from "@/lib/utils";

type SwapCardProps = {
  tokens: string[];
  from: string;
  to: string;
  input: string;
  output: string;
  rateText: string;
  fee: number;
  onChangeFrom: (v: string) => void;
  onChangeTo: (v: string) => void;
  onChangeInput: (v: string) => void;
  onSwapTokens: () => void;
  onChangeFee: (v: number) => void;
  onConfirm: () => void;
  disabled?: boolean;
  isSubmitting?: boolean;
  totalFee?: string;
};

export function SwapCard({
  tokens,
  from,
  to,
  input,
  output,
  rateText,
  fee,
  onChangeFrom,
  onChangeTo,
  onChangeInput,
  onSwapTokens,
  onChangeFee,
  onConfirm,
  disabled,
  isSubmitting = false,
  totalFee,
}: SwapCardProps) {
  const handleInputChange = (value: string) => {
    const cleanValue = value.replace(/[^0-9.]/g, "");

    const parts = cleanValue.split(".");
    if (parts.length > 2) {
      return;
    }

    let processedValue = cleanValue;
    if (/^0+\d/.test(processedValue)) {
      processedValue = processedValue.replace(/^0+/, "");
    }

    if (/^0+$/.test(cleanValue) || cleanValue === "") {
      processedValue = cleanValue === "" ? "" : "0";
    }

    onChangeInput(processedValue);
  };

  return (
    <main className="min-h-screen grid place-items-center px-4">
      <div className="w-full max-w-[520px] bg-card shadow-card rounded-xl p-4 md:p-3">
        <div className="flex items-center justify-between mb-2 py-1 pl-3">
          <h2 className="text-[18px] font-semibold tracking-wide text-soft">
            Swap
          </h2>
          <Dialog>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 rounded-[5px] border-soft text-[#a7b6cf] hover:bg-[#131b2a]/80"
                    >
                      <Settings size={15} color="#717A8C" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent className="text-xs">Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DialogContent className="sm:max-w-md bg-card border-soft !rounded-xl">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Fee (%)</Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[fee]}
                      min={0}
                      max={5}
                      step={0.1}
                      onValueChange={(v) => onChangeFee(v[0])}
                    />
                    <div className="w-16 text-right text-soft">
                      {fee.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* You pay */}
        <div className="rounded-xl bg-panel px-3 pt-5 pb-6 md:p-5 md:pt-4">
          <div className="mb-1.5">
            <span className="text-[14px] font-semibold text-muted">Send</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            {/* token chip */}
            <Select value={from} onValueChange={onChangeFrom}>
              <SelectTrigger className="w-auto min-w-[140px] !rounded-[8px] bg-select border-none px-2.5 py-5">
                <div className="flex items-center gap-2">
                  <SelectValue placeholder="Token" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#101729] border-soft rounded-[5px]">
                {tokens.map((sym) => (
                  <SelectItem
                    className="cursor-pointer hover:!bg-[#1b2540] rounded-[5px]"
                    key={sym}
                    value={sym}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={iconUrl(sym)}
                        className="h-6 w-6 rounded-full border-soft"
                        alt=""
                      />
                      <span className="text-white">{sym}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* amount */}
            <Input
              inputMode="decimal"
              placeholder="0.00"
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              className={cn(
                "bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0",
                "text-right !text-[24px] leading-none font-bold tracking-tight py-2 pr-1"
              )}
            />
          </div>

          <div className="mt-2 flex items-center justify-start text-[12px]">
            <div className="text-[12px] font-semibold">
              Balance: <span>100 {from}</span>
            </div>
          </div>
        </div>

        {/* Swap button + line */}
        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center justify-center -translate-y-1">
            <Button
              variant="outline"
              size="icon"
              onClick={onSwapTokens}
              className="h-12 w-12 rounded-full bg-[#2B3342] !border-[5px] border-[#252B36] text-[#a7b6cf] hover:bg-[#252B36]/90"
            >
              <ArrowUpDown size={16} />
            </Button>
          </div>
        </div>

        {/* You receive */}
        <div className="rounded-xl bg-panel px-3 pt-6 pb-5 md:p-5 md:pt-4">
          <div className="mb-1.5">
            <span className="text-[14px] font-semibold text-muted">
              Receive
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <Select value={to} onValueChange={onChangeTo}>
              <SelectTrigger className="w-auto min-w-[140px] !rounded-[8px] bg-select border-none px-2.5 py-5">
                <div className="flex items-center gap-2">
                  <SelectValue placeholder="Token" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#101729] border-soft rounded-[5px]">
                {tokens.map((sym) => (
                  <SelectItem
                    className="cursor-pointer hover:!bg-[#1b2540] rounded-[5px]"
                    key={sym}
                    value={sym}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={iconUrl(sym)}
                        className="h-6 w-6 rounded-full border-soft"
                        alt=""
                      />
                      <span className="text-white">{sym}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="0.00"
              value={output}
              readOnly
              className={cn(
                "bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0",
                "text-right !text-[24px] leading-none font-bold tracking-tight py-2 pr-1 opacity-75"
              )}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[12px]">
            <div className="text-[12px] font-semibold">
              Balance: <span className="text-soft">200 {to}</span>
            </div>
            <div>
              {totalFee && (
                <span className="text-[12px] font-semibold">
                  {fee}% Fee: {totalFee} {to}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="px-1 pt-2 pb-3 text-right text-[12px] font-semibold">
          {rateText}
        </div>
        <Button
          className="w-full btn-gold rounded-xl py-7 text-base font-extrabold tracking-wide hover:bg-[#b59d4f] active:brightness-95"
          onClick={onConfirm}
          disabled={disabled || isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 size={30} className="animate-spin" />
          ) : (
            "Swap"
          )}
        </Button>
      </div>
    </main>
  );
}
