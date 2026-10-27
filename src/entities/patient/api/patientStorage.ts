import type {
  Patient,
  PatientDepartureProcedureKey,
  PatientFormData,
} from "../model/types";

import {
  readPatientsStorage,
  writePatientsStorage,
} from "./patientsRepository";

/*
 * Дата последнего ежедневного сброса процедур.
 * Хранится отдельно от данных пациентов.
 */
const DEPARTURE_CHECKLIST_RESET_DATE_KEY = "patientProceduresLastResetDate";

const createDefaultDepartureChecklist = () => ({
  suppliesPrepared: false,
  injectionCompleted: false,
  recommendationsGiven: false,
});

/*
 * Текущая дата по местному времени устройства.
 * Не используем toISOString(), поскольку он
 * возвращает дату по UTC.
 */
const getTodayLocalDate = (): string => {
  const now = new Date();

  const year = now.getFullYear();

  const month = String(now.getMonth() + 1).padStart(2, "0");

  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/*
 * Ежедневный сброс процедур.
 *
 * Проверяем дату последнего сброса.
 *
 * Если дата изменилась:
 * 1. Сбрасываем все три отметки у всех пациентов.
 * 2. Сохраняем обновлённых пациентов.
 * 3. Запоминаем сегодняшнюю дату.
 *
 * Все остальные данные пациентов сохраняются.
 */
const resetDepartureChecklistsIfNeeded = (): Patient[] => {
  const patients = readPatientsStorage();

  const today = getTodayLocalDate();

  const lastResetDate = localStorage.getItem(
    DEPARTURE_CHECKLIST_RESET_DATE_KEY,
  );

  if (lastResetDate === today) {
    return patients;
  }

  const updatedPatients = patients.map((patient) => ({
    ...patient,

    departureChecklist: createDefaultDepartureChecklist(),
  }));

  if (updatedPatients.length > 0) {
    writePatientsStorage(updatedPatients);
  }

  localStorage.setItem(DEPARTURE_CHECKLIST_RESET_DATE_KEY, today);

  return updatedPatients;
};

export const getAllPatients = (): Patient[] => {
  return resetDepartureChecklistsIfNeeded();
};

export const getPatientById = (id: string): Patient | undefined => {
  const patients = getAllPatients();

  return patients.find((patient) => patient.id === id);
};

export const createPatient = (data: PatientFormData): Patient => {
  const patients = getAllPatients();

  const newPatient: Patient = {
    ...data,

    id: Date.now().toString() + Math.random().toString(36).slice(2, 6),

    createdAt: new Date().toISOString(),

    primaryAnamnesis: null,

    glycemicProfile: null,

    dailyProfile: null,

    diaryEntries: [],

    plans: [],

    departureChecklist: createDefaultDepartureChecklist(),
  };

  patients.push(newPatient);

  writePatientsStorage(patients);

  return newPatient;
};

export const updatePatient = (
  id: string,
  data: Partial<PatientFormData>,
): boolean => {
  const patients = getAllPatients();

  const index = patients.findIndex((patient) => patient.id === id);

  if (index === -1) {
    return false;
  }

  const updatedPatient: Patient = {
    ...patients[index],

    ...data,
  };

  if (data.birthDate !== undefined && updatedPatient.primaryAnamnesis) {
    updatedPatient.primaryAnamnesis = {
      ...updatedPatient.primaryAnamnesis,

      birthDate: data.birthDate,
    };
  }

  patients[index] = updatedPatient;

  writePatientsStorage(patients);

  return true;
};

export const togglePatientDepartureProcedure = (
  id: string,
  key: PatientDepartureProcedureKey,
): boolean => {
  /*
   * Проверяем дату перед каждым нажатием.
   * Если начался новый день, сначала
   * сбрасываем вчерашние отметки.
   */
  const patients = getAllPatients();

  const index = patients.findIndex((patient) => patient.id === id);

  if (index === -1) {
    return false;
  }

  const currentChecklist =
    patients[index].departureChecklist ?? createDefaultDepartureChecklist();

  patients[index] = {
    ...patients[index],

    departureChecklist: {
      ...createDefaultDepartureChecklist(),
      ...currentChecklist,

      [key]: !currentChecklist[key],
    },
  };

  writePatientsStorage(patients);

  return true;
};

export const deletePatient = (id: string): boolean => {
  const patients = getAllPatients();

  const filtered = patients.filter((patient) => patient.id !== id);

  if (filtered.length === patients.length) {
    return false;
  }

  writePatientsStorage(filtered);

  return true;
};
