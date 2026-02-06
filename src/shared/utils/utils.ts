import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FetchError, FetchParams } from "../types/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toFetchError(
  message: string,
  status?: number,
  extra?: Partial<FetchError>,
): FetchError {
  const err: FetchError = new Error(message);
  err.status = status;
  Object.assign(err, extra);
  return err;
}

export function cleanFilters(params: FetchParams): FetchParams {
  const cleanedFilters = Object.fromEntries(
    Object.entries(params).filter(([key, value]) => {
      if (value === undefined || value === null) return false;
      if (typeof value === "string" && value.trim() === "") return false;

      return true;
    }),
  );

  return cleanedFilters;
}
