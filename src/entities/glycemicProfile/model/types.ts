/**
 * Формат времени HH:mm, также допускается 24:00 как конец суток.
 * Значение проверяется при добавлении пользовательского времени.
 */
export type GlycemicProfileTime = string;

export interface GlycemicProfileMeasurement {
  time: GlycemicProfileTime;

  glycemia: number | null;

  /**
   * Старое общее поле «Инсулин, ЕД».
   * Не удаляем: в старых профилях неизвестно,
   * к какому типу инсулина относилась доза.
   */
  insulinUnits: number | null;

  breadUnits: number | null;

  bolusInsulinUnits?: number | null;

  basalInsulinUnits?: number | null;

  note: string;

  /** Пометка добавленного вручную времени, включая пустые измерения. */
  isCustom?: boolean;
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
