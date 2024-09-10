import { cn } from "@/lib/utils";
import type { PropsWithClassName } from "@/types/app";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-grayGradient text-foreground p-8 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-300",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 rounded-b-3xl data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 rounded-t-3xl data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 rounded-r-3xl h-full w-3/4 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 rounded-l-3xl h-full w-3/4 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  hideCloseButton?: boolean;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, hideCloseButton, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      onOpenAutoFocus={(e) => e.preventDefault()}
      onInteractOutside={(e) => {
        if (props.onInteractOutside) {
          props.onInteractOutside(e);
          return;
        }
        const { originalEvent } = e.detail;
        if (
          originalEvent.target instanceof Element &&
          originalEvent.target.closest(".toaster.group")
        ) {
          e.preventDefault();
        }
      }}
      {...props}
    >
      {children}
      {!hideCloseButton && (
        <SheetPrimitive.Close className="close-icon focus:ring-destructiv absolute right-7 top-7 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
          <Close />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      )}
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};

const Close = ({ className }: PropsWithClassName) => (
  <svg
    className={cn("group", className)}
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_7736_10428)">
      <path
        d="M15.99 31.2495C7.56798 31.2435 0.744981 24.4115 0.750981 15.9895C0.756981 7.56749 7.58898 0.744492 16.011 0.750492C24.429 0.756492 31.25 7.58199 31.25 16C31.2375 24.421 24.411 31.243 15.99 31.2495Z"
        fill="white"
      />
      <path
        d="M15.9895 1.501C23.9973 1.507 30.484 8.00275 30.478 16.0105C30.472 24.0182 23.9763 30.505 15.9685 30.499C7.96525 30.493 1.48 24.0033 1.48 16C1.492 7.99325 7.98275 1.507 15.9895 1.501ZM15.9895 9.41908e-07C7.15269 0.00600094 -0.00599623 7.17369 3.76889e-06 16.0105C0.00600377 24.8473 7.17369 32.006 16.0105 32C24.8428 31.994 32 24.8323 32 16C31.997 7.16069 24.8288 -0.00299906 15.9895 9.41908e-07Z"
        fill="#181E39"
      />
      <path
        d="M15.9894 3.4037C22.946 3.4082 28.5817 9.05188 28.5772 16.0084C28.5727 22.965 22.929 28.6007 15.9724 28.5962C9.01887 28.5917 3.38468 22.9535 3.38468 15.9999C3.39468 9.04438 9.03337 3.4092 15.9894 3.4037ZM15.9894 2.90338C8.75618 2.90788 2.89681 8.77519 2.90137 16.0084C2.90587 23.2417 8.77325 29.1011 16.0065 29.0965C23.2362 29.0921 29.0946 23.2297 29.0946 15.9999C29.0926 8.7647 23.2252 2.90132 15.9899 2.90332H15.9894V2.90338Z"
        className="fill-secondary-foreground group-hover:fill-red-500"
      />
      <path
        d="M10.9136 8.44725L8.4375 10.9233L21.0706 23.5564L23.5467 21.0803L10.9136 8.44725Z"
        className="fill-secondary-foreground group-hover:fill-red-500"
      />
      <path
        d="M21.0696 8.44406L8.43652 21.0771L10.9126 23.5532L23.5457 10.9201L21.0696 8.44406Z"
        className="fill-secondary-foreground group-hover:fill-red-500"
      />
    </g>
    <defs>
      <clipPath id="clip0_7736_10428">
        <rect width="32" height="32" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
