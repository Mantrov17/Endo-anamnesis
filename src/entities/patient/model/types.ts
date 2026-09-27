import type { AnamnesisRecord } from "@/entities/anamnesis/@x/patient";

import type { DiaryRecord } from "@/entities/diary/@x/patient";

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

  diaryEntries: DiaryRecord[];
}
