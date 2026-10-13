import type { GlycemicProfileTime } from "./types";

/** Базовые измерения; 24:00 — конец суток, после 21:00. */
export const GLYCEMIC_PROFILE_TIMES: GlycemicProfileTime[] = [
  "06:00",
  "09:00",
  "13:00",
  "17:00",
  "21:00",
  "24:00",
];
