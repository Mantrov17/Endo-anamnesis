import {
  readPatientsStorage,
  writePatientsStorage,
} from "@/entities/patient/@x/glycemicProfile";

import type { GlycemicProfile, GlycemicProfileDay } from "../model/types";

export const getGlycemicProfile = (
  patientId: string,
): GlycemicProfile | null => {
  const patients = readPatientsStorage();

  const patient = patients.find((item) => item.id === patientId);

  if (!patient) {
    return null;
  }

  return patient.glycemicProfile;
};

export const saveGlycemicProfile = (
  patientId: string,
  days: GlycemicProfileDay[],
): boolean => {
  const patients = readPatientsStorage();

  const patient = patients.find((item) => item.id === patientId);

  if (!patient) {
    return false;
  }

  const now = new Date().toISOString();

  patient.glycemicProfile = {
    days,

    createdAt: patient.glycemicProfile?.createdAt ?? now,

    updatedAt: now,
  };

  writePatientsStorage(patients);

  return true;
};
