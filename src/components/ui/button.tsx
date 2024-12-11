import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 dark:disabled:opacity-20",
  {
    variants: {
      variant: {
        default:
          "bg-mantle text-primary-foreground text-black shadow hover:bg-mantle-foreground dark:disabled:text-[#464646]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-transparent shadow-sm border-[#C4C4C4] dark:border-[#41474D] text-[#65B3AE] hover:opacity-80",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-[#CFD6E6] hover:text-accent-foreground",
        link: "text-primary  underline-offset-4 hover:underline",
        blue: "bg-blue-600 text-white shadow hover:bg-blue-600/90",
        emerald: "bg-emerald-600 text-white shadow hover:bg-emerald-600/90",
        walletBox:
          "bg-white text-[#464646] shadow dark:bg-[#1C1E20] dark:text-[#C4C4C4]",
      },
      size: {
        default: "h-12 rounded-lg px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
        box: "h-12 w-12 rounded-lg px-4 py-2",
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

export { Button, buttonVariants };
