"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@repo/utils/libs"

const toggleVariants = cva(
  "ui-inline-flex ui-items-center ui-justify-center ui-rounded-md ui-text-sm ui-font-medium ui-transition-colors hover:ui-bg-muted hover:ui-text-muted-foreground focus-visible:ui-outline-none focus-visible:ui-ring-1 focus-visible:ui-ring-ring disabled:ui-pointer-events-none disabled:ui-opacity-50 data-[state=on]:ui-bg-accent data-[state=on]:ui-text-accent-foreground",
  {
    variants: {
      variant: {
        default: "ui-bg-transparent",
        outline:
          "ui-border ui-border-input ui-bg-transparent ui-shadow-sm hover:ui-bg-accent hover:ui-text-accent-foreground",
      },
      size: {
        default: "ui-h-9 ui-px-3",
        sm: "ui-h-8 ui-px-2",
        lg: "ui-h-10 ui-px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
