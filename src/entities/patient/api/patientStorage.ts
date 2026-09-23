import type { Patient, PatientFormData } from "../model/types";

import {
  readPatientsStorage,
  writePatientsStorage,
} from "./patientsRepository";

export const getAllPatients = (): Patient[] => {
  return readPatientsStorage();
};

export const getPatientById = (id: string): Patient | undefined => {
  const patients = readPatientsStorage();

  return patients.find((patient) => patient.id === id);
};

export const createPatient = (data: PatientFormData): Patient => {
  const patients = readPatientsStorage();

  const newPatient: Patient = {
    ...data,

    id: Date.now().toString() + Math.random().toString(36).slice(2, 6),

    createdAt: new Date().toISOString(),

    anamneses: [],
  };

  patients.push(newPatient);

  writePatientsStorage(patients);

  return newPatient;
};

export const updatePatient = (
  id: string,
  data: Partial<PatientFormData>,
): boolean => {
  const patients = readPatientsStorage();

  const index = patients.findIndex((patient) => patient.id === id);

  if (index === -1) {
    return false;
  }

  patients[index] = {
    ...patients[index],

    ...data,
  };

  writePatientsStorage(patients);

  return true;
};

export const deletePatient = (id: string): boolean => {
  const patients = readPatientsStorage();

  const filtered = patients.filter((patient) => patient.id !== id);

  if (filtered.length === patients.length) {
    return false;
  }

  writePatientsStorage(filtered);

  return true;
};
