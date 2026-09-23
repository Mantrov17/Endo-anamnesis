import type { Patient, PatientFormData } from "../model/types";

import { PATIENTS_STORAGE_KEY } from "@/shared/config/storage";

import {
  readJsonStorage,
  writeJsonStorage,
} from "@/shared/lib/storage/jsonStorage";

const getPatients = (): Patient[] => {
  const patients = readJsonStorage<Patient[]>(PATIENTS_STORAGE_KEY, []);

  /*
   * Поддержка старых записей,
   * созданных до появления createdAt.
   *
   * Поведение сохраняем таким же,
   * как было в старом localStorageApi.
   */
  return patients.map((patient) => ({
    ...patient,

    createdAt: patient.createdAt || new Date().toISOString(),
  }));
};

const savePatients = (patients: Patient[]): void => {
  writeJsonStorage(PATIENTS_STORAGE_KEY, patients);
};

export const getAllPatients = (): Patient[] => {
  return getPatients();
};

export const getPatientById = (id: string): Patient | undefined => {
  const patients = getPatients();

  return patients.find((patient) => patient.id === id);
};

export const createPatient = (data: PatientFormData): Patient => {
  const patients = getPatients();

  const newPatient: Patient = {
    ...data,

    id: Date.now().toString() + Math.random().toString(36).slice(2, 6),

    createdAt: new Date().toISOString(),

    anamneses: [],
  };

  patients.push(newPatient);

  savePatients(patients);

  return newPatient;
};

export const updatePatient = (
  id: string,
  data: Partial<PatientFormData>,
): boolean => {
  const patients = getPatients();

  const index = patients.findIndex((patient) => patient.id === id);

  if (index === -1) {
    return false;
  }

  patients[index] = {
    ...patients[index],
    ...data,
  };

  savePatients(patients);

  return true;
};

export const deletePatient = (id: string): boolean => {
  const patients = getPatients();

  const filtered = patients.filter((patient) => patient.id !== id);

  if (filtered.length === patients.length) {
    return false;
  }

  savePatients(filtered);

  return true;
};
