import type { AnamnesisRecord } from "@/entities/anamnesis/@x/patient";

export interface PatientBase {
  fullName: string;

  birthDate: string;

  gender?: "male" | "female";
}

export type PatientFormData = PatientBase;

export interface Patient extends PatientBase {
  id: string;

  createdAt: string;

  anamneses: AnamnesisRecord[];
}
