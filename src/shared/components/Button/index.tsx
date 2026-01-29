"use client";

import { cn } from "@/shared/utils/utils";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:bg-ring [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[2px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				default:
					"border border-primary-accent-light bg-primary-accent-light disabled:border-ring text-white hover:bg-primary-accent/90 hover:border-primary-accent/90",
				destructive:
					"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
				outline:
					"border text-accent bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground",
				secondary:
					"bg-white/10 text-secondary-foreground hover:bg-white/5 disabled:opacity-50",
				ghost:
					"hover:text-accent-foreground",
				transparent: "bg-transparent p-0 h-fit w-fit hover:bg-accent/50",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
				lg: "h-12 font-semibold text-base rounded-md px-6 has-[>svg]:px-4",
				icon: "size-9",
				"icon-sm": "size-8",
				"icon-lg": "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

type ButtonProps = React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
		/** Enables the ripple overlay on press. Enabled by default. */
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
