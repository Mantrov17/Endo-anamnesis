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

import type { GravesDisease } from "./graves.ts";

import type { Eyes } from "./eyes.ts";

import type {
  AdditionalHistory,
  Examination,
  Hypoglycemia,
  Lifestyle,
  SelfMonitoring,
} from "./history.ts";

/*
 * Родственники на интерактивной родословной.
 *
 * Отцовская и материнская линии хранятся
 * раздельно, чтобы не путать родственников.
 *
 * Пробанд — пациент, для которого заполняется анамнез.
 */
export type FamilyRelativeId =
  | "paternalGrandfather"
  | "paternalGrandmother"
  | "paternalUncle"
  | "paternalAunt"
  | "father"
  | "maternalGrandfather"
  | "maternalGrandmother"
  | "maternalUncle"
  | "maternalAunt"
  | "mother"
  | "sister"
  | "brother"
  | "proband";

/*
 * Отсутствие ключа означает:
 * сахарный диабет не отмечен.
 */
export type FamilyDiabetesStatus = "type1" | "type2";

export type FamilyHistoryTree = Partial<
  Record<FamilyRelativeId, FamilyDiabetesStatus>
>;

export interface AnamnesisFormData {
  fullName?: string;

  birthDate?: string;

  gender?: "male" | "female";

  notes?: Record<string, string>;

  primaryExam?: PrimaryExam;

  type1Diabetes?: Type1Diabetes | null;

  type2Diabetes?: Type2Diabetes | null;

  gravesDisease?: GravesDisease | null;

  eyes?: Eyes;

  /*
   * Интерактивная родословная.
   *
   * Общая для СД 1 и СД 2 типа.
   * Необязательная для совместимости
   * с ранее сохранёнными анамнезами.
   */
  familyHistoryTree?: FamilyHistoryTree;

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
