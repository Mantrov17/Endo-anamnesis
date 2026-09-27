import {
  readPatientsStorage,
  writePatientsStorage,
} from "@/entities/patient/@x/anamnesis";

import type { AnamnesisFormData, AnamnesisRecord } from "../model";

const createAnamnesisId = (): string => {
  return Date.now().toString() + Math.random().toString(36).slice(2, 6);
};

export const addAnamnesis = (
  patientId: string,
  data: AnamnesisFormData,
): AnamnesisRecord | null => {
  const patients = readPatientsStorage();

  const patient = patients.find((item) => item.id === patientId);

  if (!patient) {
    return null;
  }

  /*
   * Даже если addAnamnesis случайно
   * вызывается повторно, второго
   * первичного анамнеза не появится.
   *
   * Сохраняем ID уже существующего
   * первичного анамнеза.
   */
  const record: AnamnesisRecord = {
    ...data,

    id: patient.primaryAnamnesis?.id ?? createAnamnesisId(),

    savedAt: new Date().toISOString(),
  };

  if (data.birthDate && patient.birthDate !== data.birthDate) {
    patient.birthDate = data.birthDate;
  }

  patient.primaryAnamnesis = record;

  writePatientsStorage(patients);

  return record;
};

export const getAnamnesisById = (
  patientId: string,
  anamnesisId: string,
): AnamnesisRecord | undefined => {
  const patients = readPatientsStorage();

  const patient = patients.find((item) => item.id === patientId);

  if (!patient || !patient.primaryAnamnesis) {
    return undefined;
  }

  if (patient.primaryAnamnesis.id !== anamnesisId) {
    return undefined;
  }

  return patient.primaryAnamnesis;
};

export const updateAnamnesis = (
  patientId: string,
  anamnesisId: string,
  data: Partial<AnamnesisFormData>,
): boolean => {
  const patients = readPatientsStorage();

  const patient = patients.find((item) => item.id === patientId);

  if (!patient || !patient.primaryAnamnesis) {
    return false;
  }

  if (patient.primaryAnamnesis.id !== anamnesisId) {
    return false;
  }

  if (data.birthDate && patient.birthDate !== data.birthDate) {
    patient.birthDate = data.birthDate;
  }

  patient.primaryAnamnesis = {
    ...patient.primaryAnamnesis,

    ...data,

    /*
     * Теперь savedAt означает
     * последнее сохранение первичного
     * анамнеза.
     */
    savedAt: new Date().toISOString(),
  };

  writePatientsStorage(patients);

  return true;
};

/*
 * Пока оставляем функцию для
 * совместимости API.
 *
 * Из интерфейса возможность удаления
 * первичного анамнеза убираем.
 */
export const deleteAnamnesis = (
  patientId: string,
  anamnesisId: string,
): boolean => {
  const patients = readPatientsStorage();

  const patient = patients.find((item) => item.id === patientId);

  if (!patient || !patient.primaryAnamnesis) {
    return false;
  }

  if (patient.primaryAnamnesis.id !== anamnesisId) {
    return false;
  }

  patient.primaryAnamnesis = null;

  writePatientsStorage(patients);

  return true;
};
