import {
  readPatientsStorage,
  writePatientsStorage,
} from "@/entities/patient/@x/diary";

import { getTodayLocalDate } from "../lib/diaryDate";

import type { DiaryFormData, DiaryRecord } from "../model/types";

const createDiaryId = (): string => {
  return Date.now().toString() + Math.random().toString(36).slice(2, 6);
};

export const addDiary = (
  patientId: string,
  data: DiaryFormData,
): DiaryRecord | null => {
  const patients = readPatientsStorage();

  const patient = patients.find((item) => item.id === patientId);

  if (!patient) {
    return null;
  }

  const now = new Date().toISOString();

  const diary: DiaryRecord = {
    ...data,

    id: createDiaryId(),

    date: getTodayLocalDate(),

    createdAt: now,

    updatedAt: now,
  };

  patient.diaryEntries.push(diary);

  writePatientsStorage(patients);

  return diary;
};

export const getDiaryById = (
  patientId: string,
  diaryId: string,
): DiaryRecord | undefined => {
  const patients = readPatientsStorage();

  const patient = patients.find((item) => item.id === patientId);

  if (!patient) {
    return undefined;
  }

  return patient.diaryEntries.find((diary) => diary.id === diaryId);
};

export const updateDiary = (
  patientId: string,
  diaryId: string,
  data: DiaryFormData,
): boolean => {
  const patients = readPatientsStorage();

  const patient = patients.find((item) => item.id === patientId);

  if (!patient) {
    return false;
  }

  const index = patient.diaryEntries.findIndex((diary) => diary.id === diaryId);

  if (index === -1) {
    return false;
  }

  const currentDiary = patient.diaryEntries[index];

  patient.diaryEntries[index] = {
    ...currentDiary,

    ...data,

    /*
     * ID, дата создания дневника
     * и createdAt остаются прежними.
     */
    id: currentDiary.id,

    date: currentDiary.date,

    createdAt: currentDiary.createdAt,

    updatedAt: new Date().toISOString(),
  };

  writePatientsStorage(patients);

  return true;
};

export const deleteDiary = (patientId: string, diaryId: string): boolean => {
  const patients = readPatientsStorage();

  const patient = patients.find((item) => item.id === patientId);

  if (!patient) {
    return false;
  }

  const initialLength = patient.diaryEntries.length;

  patient.diaryEntries = patient.diaryEntries.filter(
    (diary) => diary.id !== diaryId,
  );

  if (patient.diaryEntries.length === initialLength) {
    return false;
  }

  writePatientsStorage(patients);

  return true;
};
