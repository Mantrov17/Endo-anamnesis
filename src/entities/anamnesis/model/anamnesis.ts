import type {
  H2FPEF,
  HeartFailure,
  Measurements,
  SecondaryHypertension,
} from "./cardiovascular.ts";

import type { Complications } from "./complications.ts";

import type {
  ActualTherapy,
  PrimaryExam,
  Therapy,
  Type1Diabetes,
  Type2Diabetes,
} from "./diabetes.ts";

import type {
  AdditionalHistory,
  Examination,
  Hypoglycemia,
  Lifestyle,
  SelfMonitoring,
} from "./history.ts";

export interface AnamnesisFormData {
  fullName?: string;

  birthDate?: string;

  gender?: "male" | "female";

  notes?: Record<string, string>;

  primaryExam?: PrimaryExam;

  type1Diabetes?: Type1Diabetes | null;

  type2Diabetes?: Type2Diabetes | null;

  actualTherapy?: ActualTherapy;

  therapy?: Therapy;

  hypoglycemia?: Hypoglycemia;

  selfMonitoring?: SelfMonitoring;

  complications?: Complications;

  examination?: Examination;

  lifestyle?: Lifestyle;

  measurements?: Measurements;

  secondaryHypertension?: SecondaryHypertension;

  heartFailure?: HeartFailure;

  h2fpef?: H2FPEF;

  additionalHistory?: AdditionalHistory;
}

export interface AnamnesisRecord extends AnamnesisFormData {
  id: string;

  savedAt: string;
}
