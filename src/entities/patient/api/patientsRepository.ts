import {
  PATIENTS_STORAGE_KEY,
  PATIENTS_STORAGE_VERSION,
  PATIENTS_STORAGE_VERSION_KEY,
} from "@/shared/config/storage";

import {
  readJsonStorage,
  StorageWriteError,
  writeJsonStorage,
} from "@/shared/lib/storage/jsonStorage";

import type { Patient } from "../model/types";

type PrimaryAnamnesisRecord = NonNullable<Patient["primaryAnamnesis"]>;

type StoredDiaryRecord = Patient["diaryEntries"][number];

type StoredPatient = Omit<
  Patient,
  "createdAt" | "primaryAnamnesis" | "diaryEntries"
> & {
  createdAt?: string;

  primaryAnamnesis?: PrimaryAnamnesisRecord | null;

  /*
   * Старая схема до появления
   * primaryAnamnesis.
   */
  anamneses?: PrimaryAnamnesisRecord[];

  /*
   * Отсутствует у пациентов,
   * созданных до появления дневников.
   */
  diaryEntries?: StoredDiaryRecord[];
};

const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const isStoredPatient = (value: unknown): value is StoredPatient => {
  if (!isObject(value)) {
    return false;
  }

  if (
    typeof value.id !== "string" ||
    typeof value.fullName !== "string" ||
    typeof value.birthDate !== "string"
  ) {
    return false;
  }

  if (value.createdAt !== undefined && typeof value.createdAt !== "string") {
    return false;
  }

  if (
    value.gender !== undefined &&
    value.gender !== "male" &&
    value.gender !== "female"
  ) {
    return false;
  }

  if (value.anamneses !== undefined && !Array.isArray(value.anamneses)) {
    return false;
  }

  if (
    value.primaryAnamnesis !== undefined &&
    value.primaryAnamnesis !== null &&
    !isObject(value.primaryAnamnesis)
  ) {
    return false;
  }

  if (value.diaryEntries !== undefined && !Array.isArray(value.diaryEntries)) {
    return false;
  }

  return true;
};

const isStoredPatientsArray = (value: unknown): value is StoredPatient[] => {
  return Array.isArray(value) && value.every(isStoredPatient);
};

const isStorageVersion = (value: unknown): value is number => {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
};

const readStorageVersion = (): number => {
  return readJsonStorage<number>(
    PATIENTS_STORAGE_VERSION_KEY,
    0,
    isStorageVersion,
  );
};

const getLatestLegacyAnamnesis = (
  anamneses: PrimaryAnamnesisRecord[],
): PrimaryAnamnesisRecord | null => {
  if (anamneses.length === 0) {
    return null;
  }

  return anamneses.reduce((latest, current) => {
    const latestTimestamp = Date.parse(latest.savedAt);

    const currentTimestamp = Date.parse(current.savedAt);

    const safeLatestTimestamp = Number.isFinite(latestTimestamp)
      ? latestTimestamp
      : 0;

    const safeCurrentTimestamp = Number.isFinite(currentTimestamp)
      ? currentTimestamp
      : 0;

    return safeCurrentTimestamp >= safeLatestTimestamp ? current : latest;
  });
};

const migrateStoredPatient = (patient: StoredPatient): Patient => {
  const primaryAnamnesis =
    patient.primaryAnamnesis !== undefined
      ? patient.primaryAnamnesis
      : getLatestLegacyAnamnesis(patient.anamneses ?? []);

  return {
    id: patient.id,

    fullName: patient.fullName,

    birthDate: patient.birthDate,

    gender: patient.gender,

    createdAt: patient.createdAt || new Date().toISOString(),

    primaryAnamnesis,

    diaryEntries: patient.diaryEntries ?? [],
  };
};

const needsMigration = (
  patients: StoredPatient[],
  version: number,
): boolean => {
  if (version !== PATIENTS_STORAGE_VERSION) {
    return true;
  }

  return patients.some(
    (patient) =>
      "anamneses" in patient ||
      !("primaryAnamnesis" in patient) ||
      !("diaryEntries" in patient) ||
      !patient.createdAt,
  );
};

const persistMigration = (patients: Patient[]): void => {
  try {
    writeJsonStorage(PATIENTS_STORAGE_KEY, patients);

    try {
      writeJsonStorage(PATIENTS_STORAGE_VERSION_KEY, PATIENTS_STORAGE_VERSION);
    } catch (error) {
      console.warn(
        "Данные пациентов мигрированы, но не удалось сохранить номер версии схемы.",
        error,
      );
    }
  } catch (error) {
    console.warn("Не удалось записать мигрированные данные пациентов.", error);
  }
};

export const readPatientsStorage = (): Patient[] => {
  const storedPatients = readJsonStorage<StoredPatient[]>(
    PATIENTS_STORAGE_KEY,
    [],
    isStoredPatientsArray,
  );

  const version = readStorageVersion();

  const patients = storedPatients.map(migrateStoredPatient);

  if (version > PATIENTS_STORAGE_VERSION) {
    console.warn(
      `patientsData имеет более новую версию схемы (${version}), чем поддерживает приложение (${PATIENTS_STORAGE_VERSION}).`,
    );

    return patients;
  }

  if (storedPatients.length === 0) {
    return patients;
  }

  if (needsMigration(storedPatients, version)) {
    persistMigration(patients);
  }

  return patients;
};

export const writePatientsStorage = (patients: Patient[]): void => {
  const currentStoredVersion = readStorageVersion();

  if (currentStoredVersion > PATIENTS_STORAGE_VERSION) {
    throw new StorageWriteError("incompatible-version", PATIENTS_STORAGE_KEY);
  }

  writeJsonStorage(PATIENTS_STORAGE_KEY, patients);

  try {
    writeJsonStorage(PATIENTS_STORAGE_VERSION_KEY, PATIENTS_STORAGE_VERSION);
  } catch (error) {
    console.warn(
      "Данные сохранены, но не удалось записать номер версии схемы.",
      error,
    );
  }
};
