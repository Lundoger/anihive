"use client";

import NextTopLoader from "nextjs-toploader";

export function TopLoader() {
  return (
    <NextTopLoader
      color="var(--color-primary-accent-light)"
      height={2}
      showSpinner={false}
      zIndex={10000}
    />
  );
}
