import type { AnamnesisRecord } from "@/entities/anamnesis/@x/patient";

import type { DiaryRecord } from "@/entities/diary/@x/patient";

import type { GlycemicProfile } from "@/entities/glycemicProfile/@x/patient";

import type { PlanRecord } from "@/entities/plan/@x/patient";

export interface PatientBase {
  fullName: string;

  birthDate: string;

  gender?: "male" | "female";
}

export type PatientFormData = PatientBase;

export interface Patient extends PatientBase {
  id: string;

  createdAt: string;

  primaryAnamnesis: AnamnesisRecord | null;

  glycemicProfile: GlycemicProfile | null;

  diaryEntries: DiaryRecord[];

  /*
   * Планы являются отдельной сущностью.
   *
   * Они не принадлежат конкретному
   * дневнику и связываются с ним
   * только по совпадению даты.
   */
  plans: PlanRecord[];
}
