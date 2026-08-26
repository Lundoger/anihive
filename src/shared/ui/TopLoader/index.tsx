"use client";

import NextTopLoader from "nextjs-toploader";

export function TopLoader() {
  return (
    <NextTopLoader
      color="var(--color-primary)"
      height={2}
      showSpinner={false}
      zIndex={10000}
    />
  );
}
