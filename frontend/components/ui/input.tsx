import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  focusRingColor?: string;
  enableFocusRing?: boolean; // Add this prop
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, focusRingColor, enableFocusRing = true, ...props },
    ref
  ) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          enableFocusRing
            ? cn(
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                focusRingColor
                  ? `focus-visible:ring-${focusRingColor}`
                  : "focus-visible:ring-ring"
              )
            : "focus-visible:outline-none", // When focus ring is disabled
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
