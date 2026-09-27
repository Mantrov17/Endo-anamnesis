export type GlycemicProfileTime =
  | "06:00"
  | "13:00"
  | "17:00"
  | "21:00"
  | "24:00";

export interface GlycemicProfileMeasurement {
  time: GlycemicProfileTime;

  glycemia: number | null;

  insulinUnits: number | null;

  note: string;
}

export interface GlycemicProfileDay {
  id: string;

  date: string;

  measurements: GlycemicProfileMeasurement[];
}

export interface GlycemicProfile {
  days: GlycemicProfileDay[];

  createdAt: string;

  updatedAt: string;
}
