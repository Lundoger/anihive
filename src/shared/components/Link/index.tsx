import { cn } from "@/shared/utils/utils";
import { type VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import * as React from "react";

const linkVariants = cva("basic-transition inline-flex items-center relative", {
  variants: {
    variant: {
      default: "desc hover:text-primary-accent-light",
      secondary:
        "isolate overflow-hidden px-[2px] opacity-50 before:pointer-events-none before:content-[''] before:absolute before:inset-0 before:-z-10 before:bg-white/10 before:origin-bottom before:scale-y-0 before:transform-gpu before:transition-transform before:duration-200 before:ease-linear hover:before:scale-y-100",
      underline:
        "pb-[2px] after:pointer-events-none after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-white after:origin-left after:scale-x-0 after:transform-gpu after:transition-transform after:duration-200 after:ease-linear hover:after:scale-x-100",
      transparent: "",
      nav: "text-sm font-medium hover:text-primary-accent-light",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type LinkProps = React.ComponentPropsWithoutRef<typeof Link> &
  VariantProps<typeof linkVariants> & {
    external?: boolean;
  };

function addRel(currentRel: string | undefined, relToAdd: string): string {
  if (!currentRel) return relToAdd;

  const existing = new Set(
    currentRel
      .split(" ")
      .map((t) => t.trim())
      .filter(Boolean),
  );

  for (const token of relToAdd.split(" ").filter(Boolean)) {
    existing.add(token);
  }

  return Array.from(existing).join(" ");
}

function isExternalHref(href: LinkProps["href"]): boolean {
  if (typeof href !== "string") return false;
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

const AppLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, external, target, rel, href, ...props }, ref) => {
    const isExternal = external ?? isExternalHref(href);
    const resolvedTarget = isExternal ? (target ?? "_blank") : target;
    const resolvedRel = isExternal ? addRel(rel, "noopener noreferrer") : rel;

    return (
      <Link
        ref={ref}
        href={href}
        target={resolvedTarget}
        rel={resolvedRel}
        className={cn(linkVariants({ variant }), className)}
        {...props}
      />
    );
  },
);

AppLink.displayName = "AppLink";

export { AppLink, linkVariants };
