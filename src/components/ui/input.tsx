import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { type InputHTMLAttributes, forwardRef } from "react";

const inputVariants = cva(
  "w-full px-2 py-3 border border-white rounded-xl bg-transparent font-semibold"
);

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  wrapperClassName?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ wrapperClassName, className, label, ...props }, ref) => (
    <div className={wrapperClassName}>
      {!!label && <div className="mb-1 font-semibold">{label}</div>}
      <input
        className={cn(inputVariants({ className }))}
        {...props}
        ref={ref}
      />
    </div>
  )
);
