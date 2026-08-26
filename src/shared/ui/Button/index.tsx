"use client";

import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/shared/lib/classnames";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium basic-transition outline-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus-visible:ring-[2px] focus-visible:ring-ring/50 aria-invalid:border-danger aria-invalid:ring-[2px] aria-invalid:ring-danger/40",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-hover",
        secondary: "bg-white/10 text-foreground hover:bg-white/15",
        outline: "border border-border text-foreground hover:bg-surface-alt",
        ghost:
          "text-muted-foreground hover:bg-surface-alt hover:text-foreground",
        danger: "bg-danger text-white hover:bg-danger/90",
      },
      size: {
        sm: "h-9 gap-1.5 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-6 font-semibold",
        "icon-sm": "size-8",
        icon: "size-10",
        "icon-lg": "size-12",
        bare: "h-auto w-auto p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    /** Enables the ripple overlay on press. Disabled by default. */
    ripple?: boolean;
    /** Ripple color (CSS color). Defaults to a white translucent ripple. */
    rippleColor?: string;
    /** Ripple animation duration in ms. */
    rippleDurationMs?: number;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ripple = false,
  rippleColor = "rgba(255,255,255,0.35)",
  rippleDurationMs = 600,
  onPointerDown,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  const handlePointerDown: React.PointerEventHandler<HTMLButtonElement> = (
    e,
  ) => {
    onPointerDown?.(e);
    if (!ripple) return;
    if (props.disabled) return;

    const target = e.currentTarget;

    // Some elements (e.g. <input>) can't have children; also avoid when rendered via Slot into non-container.
    if (!(target instanceof HTMLElement)) return;

    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const sizePx = Math.ceil(Math.max(rect.width, rect.height) * 2);

    const rippleEl = document.createElement("span");
    rippleEl.dataset.ripple = "true";

    rippleEl.style.position = "absolute";
    rippleEl.style.left = `${x}px`;
    rippleEl.style.top = `${y}px`;
    rippleEl.style.width = `${sizePx}px`;
    rippleEl.style.height = `${sizePx}px`;
    rippleEl.style.borderRadius = "9999px";
    rippleEl.style.transform = "translate(-50%, -50%) scale(0)";
    rippleEl.style.opacity = "0.6";
    rippleEl.style.backgroundColor = rippleColor;
    rippleEl.style.pointerEvents = "none";
    rippleEl.style.willChange = "transform,opacity";
    rippleEl.style.zIndex = "0";

    target.appendChild(rippleEl);

    const animation = rippleEl.animate(
      [
        { transform: "translate(-50%, -50%) scale(0)", opacity: 0.6 },
        { transform: "translate(-50%, -50%) scale(1)", opacity: 0 },
      ],
      { duration: rippleDurationMs, easing: "ease-out", fill: "forwards" },
    );

    animation.addEventListener("finish", () => {
      rippleEl.remove();
    });
  };

  return (
    <Comp
      data-slot="button"
      onPointerDown={handlePointerDown}
      className={cn(
        buttonVariants({ variant, size, className }),
        ripple &&
          "relative isolate overflow-hidden [&>*:not([data-ripple=true])]:relative [&>*:not([data-ripple=true])]:z-10",
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
