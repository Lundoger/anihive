import { cn } from "@/shared/utils/utils";
import { type VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import * as React from "react";

const linkVariants = cva("basic-transition inline-flex items-center relative", {
  variants: {
    variant: {
      default: "py-[2px] before:absolute before:bottom-0 before:left-0 before:w-full before:h-0 before:bg-primary-accent-light before:transition-all before:duration-200 before:ease-linear hover:before:h-[2px]",
      secondary: "desc hover:text-primary-accent-light",
      underline:
        "pb-[2px] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0 after:bg-primary-accent-light after:transition-all after:duration-200 after:ease-linear hover:after:h-[2px]",
      subtle: "text-sm opacity-70 hover:opacity-100",
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
