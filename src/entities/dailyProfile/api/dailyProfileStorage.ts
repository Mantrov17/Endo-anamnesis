import {
  readPatientsStorage,
  writePatientsStorage,
} from "@/entities/patient/@x/dailyProfile";

import type { DailyProfile, DailyProfileDay } from "../model/types";

export const getDailyProfile = (patientId: string): DailyProfile | null => {
  const patients = readPatientsStorage();
  const patient = patients.find((item) => item.id === patientId);

  if (!patient) {
    return null;
  }

  return patient.dailyProfile;
};

export const saveDailyProfile = (
  patientId: string,
  days: DailyProfileDay[],
): boolean => {
  const patients = readPatientsStorage();
  const patient = patients.find((item) => item.id === patientId);

  if (!patient) {
    return false;
  }

  const now = new Date().toISOString();

  patient.dailyProfile = {
    days,
    createdAt: patient.dailyProfile?.createdAt ?? now,
    updatedAt: now,
  };

  writePatientsStorage(patients);

  return true;
};
