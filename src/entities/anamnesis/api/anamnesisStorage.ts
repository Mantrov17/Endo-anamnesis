import {
  readPatientsStorage,
  writePatientsStorage,
} from "@/entities/patient/@x/anamnesis";

import type { AnamnesisFormData, AnamnesisRecord } from "../model";

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
   * Дата рождения может быть неизвестна
   * при создании пациента и введена позже
   * во время первичного осмотра.
   *
   * В таком случае синхронизируем её
   * с основной карточкой пациента.
   */
  if (data.birthDate && patient.birthDate !== data.birthDate) {
    patient.birthDate = data.birthDate;
  }

  const newAnamnesis: AnamnesisRecord = {
    ...data,

    id: Date.now().toString() + Math.random().toString(36).slice(2, 6),

    savedAt: new Date().toISOString(),
  };

  patient.anamneses.push(newAnamnesis);

  writePatientsStorage(patients);

  return newAnamnesis;
};

export const getAnamnesisById = (
  patientId: string,
  anamnesisId: string,
): AnamnesisRecord | undefined => {
  const patients = readPatientsStorage();

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
  const patients = readPatientsStorage();

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

  if (data.birthDate && patient.birthDate !== data.birthDate) {
    patient.birthDate = data.birthDate;
  }

  patient.anamneses[index] = {
    ...patient.anamneses[index],

    ...data,
  };

  writePatientsStorage(patients);

  return true;
};

export const deleteAnamnesis = (
  patientId: string,
  anamnesisId: string,
): boolean => {
  const patients = readPatientsStorage();

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

  writePatientsStorage(patients);

  return true;
};
