import type { Patient } from "@/entities/patient/@x/anamnesis";

import { PATIENTS_STORAGE_KEY } from "@/shared/config/storage";

import {
  readJsonStorage,
  writeJsonStorage,
} from "@/shared/lib/storage/jsonStorage";

import type { AnamnesisFormData, AnamnesisRecord } from "../model";

const getPatients = (): Patient[] => {
  const patients = readJsonStorage<Patient[]>(PATIENTS_STORAGE_KEY, []);

  return patients.map((patient) => ({
    ...patient,

    createdAt: patient.createdAt || new Date().toISOString(),
  }));
};

const savePatients = (patients: Patient[]): void => {
  writeJsonStorage(PATIENTS_STORAGE_KEY, patients);
};

export const addAnamnesis = (
  patientId: string,

  data: AnamnesisFormData,
): AnamnesisRecord | null => {
  const patients = getPatients();

  const patient = patients.find((item) => item.id === patientId);

  if (!patient) {
    return null;
  }

  const newAnamnesis: AnamnesisRecord = {
    ...data,

    id: Date.now().toString() + Math.random().toString(36).slice(2, 6),

    savedAt: new Date().toISOString(),
  };

  patient.anamneses.push(newAnamnesis);

  savePatients(patients);

  return newAnamnesis;
};

export const getAnamnesisById = (
  patientId: string,
  anamnesisId: string,
): AnamnesisRecord | undefined => {
  const patients = getPatients();

  const patient = patients.find((item) => item.id === patientId);

  if (!patient) {
    return undefined;
  }

  return patient.anamneses.find((anamnesis) => anamnesis.id === anamnesisId);
};

export const updateAnamnesis = (
  patientId: string,
  anamnesisId: string,

  data: Partial<AnamnesisFormData>,
): boolean => {
  const patients = getPatients();

  const patient = patients.find((item) => item.id === patientId);

  if (!patient) {
    return false;
  }

  const index = patient.anamneses.findIndex(
    (anamnesis) => anamnesis.id === anamnesisId,
  );

  if (index === -1) {
    return false;
  }

  patient.anamneses[index] = {
    ...patient.anamneses[index],

    ...data,
  };

  savePatients(patients);

  return true;
};

export const deleteAnamnesis = (
  patientId: string,
  anamnesisId: string,
): boolean => {
  const patients = getPatients();

  const patient = patients.find((item) => item.id === patientId);

  if (!patient) {
    return false;
  }

  const initialLength = patient.anamneses.length;

  patient.anamneses = patient.anamneses.filter(
    (anamnesis) => anamnesis.id !== anamnesisId,
  );

  if (patient.anamneses.length === initialLength) {
    return false;
  }

  savePatients(patients);

  return true;
};
