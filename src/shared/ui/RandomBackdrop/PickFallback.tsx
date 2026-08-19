"use client";

import { useEffect } from "react";

import {
  type RandomBackdropOptions,
  pickRandomBackdrop,
} from "./lib/bootstrap";

/**
 * Covers soft navigation, where React inserts the markup and the inline script
 * next to it is not guaranteed to run. On a hard navigation the script has
 * already applied the pick and this is a no-op.
 */
export function PickFallback({ options }: { options: RandomBackdropOptions }) {
  useEffect(() => {
    pickRandomBackdrop(options);
  }, [options]);

  return null;
}
