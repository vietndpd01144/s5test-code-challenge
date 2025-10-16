import z from "zod";

export type SwapCoinBodyType = z.infer<typeof SwapCoinBody>;
export const SwapCoinBody = z
  .object({
    from: z.string().min(1, "Select send token"),
    to: z.string().min(1, "Select receive token"),
    inputAmount: z
      .string()
      .trim()
      .refine((v) => v !== "", "Please enter send amount number.")
      .refine((v) => Number(v) > 0, "Send amount number must > 0."),
    feePct: z.number().min(0).max(100),
  })
  .refine((d) => d.from !== d.to, {
    path: ["to"],
    message: "Send and Receive token must difference.",
  });
