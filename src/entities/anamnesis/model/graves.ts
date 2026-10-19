/**
 * Болезнь Грейвса: отдельная структура анамнеза.
 * Порядок в clinicalManifestations — порядок выбранных симптомов.
 */
export const GRAVES_SYMPTOMS = [
  { key: "weakness", label: "Общая слабость" },
  { key: "anxiety", label: "Тревога" },
  { key: "irritability", label: "Раздражительность" },
  { key: "palpitations", label: "Ощущение сердцебиения" },
  { key: "tachycardia", label: "Тахикардия" },
  { key: "handTremor", label: "Тремор рук" },
  { key: "dyspnea", label: "Одышка" },
  { key: "sweating", label: "Потливость" },
  { key: "heatIntolerance", label: "Непереносимость жары" },
  { key: "fever", label: "Повышение температуры" },
  { key: "weightLoss", label: "Потеря веса" },
  { key: "diarrhea", label: "Диарея" },
] as const;

export type GravesSymptomKey = (typeof GRAVES_SYMPTOMS)[number]["key"];

export interface GravesDisease {
  /** ISO YYYY-MM-DD, поле вводится пользователем в виде ДД.ММ.ГГГГ. */
  firstSymptomsDate: string;

  /** Выбранные симптомы в порядке, заданном врачом. */
  clinicalManifestations: GravesSymptomKey[];

  visitedEndocrinologist: boolean | null;
  endocrinologistVisitDate: string;
  diagnosisDate: string;
}
