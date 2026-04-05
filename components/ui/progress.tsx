"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

// 1️⃣ Define props interface including the extra prop
export interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string
}

// 2️⃣ Use the interface in forwardRef generic
const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, indicatorClassName, value, ...props }, ref) => {
    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn("relative h-4 w-full overflow-hidden rounded-full bg-secondary", className)}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn("h-full flex-1 bg-primary transition-all", indicatorClassName)}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
    )
  }
)

Progress.displayName = "Progress"

export { Progress }