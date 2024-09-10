import { cn } from "@/lib/utils";
import type { PropsWithClassName } from "@/types/app";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DialogContentProps {
  hideCloseButton?: boolean;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> &
    DialogContentProps
>(({ className, children, hideCloseButton, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-11/12 text-foreground max-w-sm translate-x-[-50%] translate-y-[-50%] gap-4 bg-grayGradient px-4 py-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-3xl",
        className
      )}
      onOpenAutoFocus={(e) => e.preventDefault()}
      {...props}
    >
      {children}

      {!hideCloseButton && (
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm ring-offset-background transition-opacity focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-foreground close-popup">
          <Close />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
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
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-secondary-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
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
