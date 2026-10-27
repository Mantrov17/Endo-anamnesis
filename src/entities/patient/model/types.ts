import type { AnamnesisRecord } from "@/entities/anamnesis/@x/patient";

import type { DailyProfile } from "@/entities/dailyProfile/@x/patient";

import type { DiaryRecord } from "@/entities/diary/@x/patient";

import type { GlycemicProfile } from "@/entities/glycemicProfile/@x/patient";

import type { PlanRecord } from "@/entities/plan/@x/patient";

export interface PatientBase {
  fullName: string;

  birthDate: string;

  gender?: "male" | "female";
}

export type PatientFormData = PatientBase;

export interface PatientDepartureChecklist {
  suppliesPrepared: boolean;

  injectionCompleted: boolean;

  recommendationsGiven: boolean;
}

export type PatientDepartureProcedureKey = keyof PatientDepartureChecklist;

export interface Patient extends PatientBase {
  id: string;

  createdAt: string;

  primaryAnamnesis: AnamnesisRecord | null;

  glycemicProfile: GlycemicProfile | null;

  dailyProfile: DailyProfile | null;

  diaryEntries: DiaryRecord[];

  /*
   * Планы являются отдельной сущностью.
   *
   * Они не принадлежат конкретному
   * дневнику и связываются с ним
   * только по совпадению даты.
   */
  plans: PlanRecord[];

  /*
   * Чек-лист выполненных процедур
   * перед уходом врача.
   */
  departureChecklist: PatientDepartureChecklist;
}
