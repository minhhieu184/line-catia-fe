import { cn } from "@/lib/utils";
import type { PropsWithClassNameAndChildren } from "@/types/app";

export const GradientText = ({
  children,
  className,
}: PropsWithClassNameAndChildren) => {
  return (
    <span
      className={cn(
        "inline-block bg-clip-text font-semibold text-transparent bg-gradient-to-r from-[#00E3D0] via-[#0DC9EB] to-primary",
        className
      )}
    >
      {children}
    </span>
  );
};
