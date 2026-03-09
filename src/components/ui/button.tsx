import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_18px_40px_-22px_rgba(255,255,255,0.9)] hover:bg-primary/92",
        destructive:
          "bg-destructive text-destructive-foreground shadow-[0_18px_40px_-24px_rgba(239,68,68,0.8)] hover:bg-destructive/90",
        outline:
          "border border-white/10 bg-white/[0.03] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-white/[0.06]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-white/[0.06]",
        ghost: "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-3.5 sm:h-10 sm:px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6 text-sm sm:text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean
}

const loadingIconSizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-4 w-4",
  sm: "h-3.5 w-3.5",
  lg: "h-5 w-5",
  icon: "h-4 w-4",
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, className, disabled, isLoading = false, size, ...props }, ref) => (
    <Button
      aria-busy={isLoading}
      className={cn("relative", className)}
      disabled={disabled || isLoading}
      ref={ref}
      size={size}
      {...props}
    >
      <span
        className={cn(
          "inline-flex items-center justify-center gap-2",
          isLoading && "opacity-0"
        )}
      >
        {children}
      </span>
      {isLoading ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 inline-flex items-center justify-center"
        >
          <Loader2
            className={cn("animate-spin", loadingIconSizes[size ?? "default"])}
          />
        </span>
      ) : null}
    </Button>
  )
)
LoadingButton.displayName = "LoadingButton"

export { Button, LoadingButton, buttonVariants }
