import { GLYCEMIC_PROFILE_TIMES } from "../model/constants";

import type { GlycemicProfileDay } from "../model/types";

const createDayId = (): string => {
  return Date.now().toString() + Math.random().toString(36).slice(2, 6);
};

export const getTodayLocalDate = (): string => {
  const date = new Date();

  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const createGlycemicProfileDay = (
  date = getTodayLocalDate(),
): GlycemicProfileDay => {
  return {
    id: createDayId(),

    date,

    measurements: GLYCEMIC_PROFILE_TIMES.map((time) => ({
      time,

      glycemia: null,

      insulinUnits: null,

      note: "",
    })),
  };
};
