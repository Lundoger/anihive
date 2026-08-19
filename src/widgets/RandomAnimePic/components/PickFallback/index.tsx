"use client";

import { useEffect } from "react";

import { AUTH_BACKGROUND, pickAuthBackground } from "../../bootstrap";

export function PickFallback() {
  useEffect(() => {
    pickAuthBackground(AUTH_BACKGROUND);
  }, []);

  return null;
}
