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

export interface GravesDrug {
  drugName: string;
  tradeName: string;
  dose: string;
  frequency: string;
  frequencyPeriod: "day" | "week" | "month";
  timesOfDay: {
    morning: boolean;
    day: boolean;
    evening: boolean;
    night: boolean;
  };
}

export interface GravesLabResult {
  /** Значение вводится как текст, чтобы поддержать десятичную запятую. */
  value: string;
  /** ISO YYYY-MM-DD, отображается как ДД.ММ.ГГГГ. */
  date: string;
}

export interface GravesDisease {
  /** ISO YYYY-MM-DD, поле вводится пользователем в виде ДД.ММ.ГГГГ. */
  firstSymptomsDate: string;

  /** Выбранные симптомы в порядке, заданном врачом. */
  clinicalManifestations: GravesSymptomKey[];

  visitedEndocrinologist: boolean | null;
  endocrinologistVisitDate: string;
  diagnosisDate: string;

  therapy: {
    medications: GravesDrug[];
    correction: boolean | null;
    correctionReason: string;
    correctedTherapy: string;
    selfDoseChange: boolean | null;
    selfDiscontinuation: boolean | null;
  };

  laboratory: {
    tsh: GravesLabResult;
    freeT4: GravesLabResult;
    freeT3: GravesLabResult;
    antibodiesEnabled: boolean | null;
    antiTPO: string;
    antiTG: string;
  };
}
