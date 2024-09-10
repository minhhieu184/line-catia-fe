import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "text-white bg-gradient-to-r from-[#00E3D0] via-[#0DC9EB] to-primary hover:bg-gradient-to-l disabled:bg-[#B2B2B2] disabled:text-[#D6D6D6] disabled:bg-none",
        destructive: "bg-destructive text-foreground hover:bg-destructive/90",
        outline:
          "border border-primary bg-transparent hover:bg-accent hover:text-accent-foreground shadow-[inset_0_0_1px] shadow-primary disabled:border-[#B2B2B2] disabled:text-[#D6D6D6] disabled:shadow-[#B2B2B2] disabled:bg-[#B2B2B2]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:bg-[#DEDFE0] disabled:text-[#D6D6D6]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 py-3 text-xl",
        sm: "h-10 px-3 text-15",
        lg: "h-11 px-8 text-xl",
        xs: "h-6 p-2 text-xs font-normal",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

interface Button3DProps extends ButtonProps {
  contentClassName?: string;
}

const Button3D = React.forwardRef<HTMLButtonElement, Button3DProps>(
  ({ className, contentClassName, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "group relative inline-flex h-[60px] w-full items-center justify-center whitespace-nowrap rounded-3xl bg-primary",
          className
        )}
        ref={ref}
        {...props}
      >
        <div
          className={cn(
            "relative z-0 inline-flex h-[60px] w-full -translate-y-1.5 items-center justify-center whitespace-nowrap rounded-3xl bg-secondary px-5 py-4 text-[28px] font-semibold transition-transform duration-100 active:translate-y-0 group-active:translate-y-0",
            contentClassName
          )}
        >
          {children}
        </div>
      </button>
    );
  }
);
Button3D.displayName = "Button3D";

export { Button, Button3D, buttonVariants };
