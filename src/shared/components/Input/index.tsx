"use client";

import { cn } from "@/shared/utils/utils";
import * as React from "react";

type InputProps = React.ComponentProps<"input"> & {
  prefixIcon?: React.ReactNode;
};

function Input({
  className,
  type,
  prefixIcon,
  placeholder,
  ...props
}: InputProps) {
  const input = (
    <input
      data-slot="input"
      type={type}
      placeholder={placeholder ?? " "}
      className={cn(
        "border-gray basic-transition flex h-14 w-full rounded-md border bg-black px-3 py-2 text-base font-medium shadow-xs hover:border-white",
        "ring-offset-background placeholder:text-muted-foreground file:border-0 file:bg-transparent file:text-base file:font-medium",
        "focus-visible:border-primary-accent-light focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        prefixIcon ? "pl-11" : "pl-3",
        className,
      )}
      {...props}
    />
  );

  if (!prefixIcon) {
    return input;
  }

  return (
    <div data-slot="input-wrapper" className="relative">
      <span
        data-slot="input-prefix"
        className="text-gray pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 [&_svg]:size-5"
        aria-hidden
      >
        {prefixIcon}
      </span>
      {input}
    </div>
  );
}

export { Input };
