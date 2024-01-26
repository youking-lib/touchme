"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@repo/utils/libs";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Range>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "ui-relative ui-flex ui-w-full ui-touch-none ui-select-none ui-items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="ui-relative ui-h-1.5 ui-w-full ui-grow ui-overflow-hidden ui-rounded-full ui-bg-primary/20">
      <SliderPrimitive.Range className="ui-absolute ui-h-full ui-bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="ui-block ui-h-4 ui-w-4 ui-rounded-full ui-border ui-border-primary/50 ui-bg-background ui-shadow ui-transition-colors focus-visible:ui-outline-none focus-visible:ui-ring-1 focus-visible:ui-ring-ring disabled:ui-pointer-events-none disabled:ui-opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
