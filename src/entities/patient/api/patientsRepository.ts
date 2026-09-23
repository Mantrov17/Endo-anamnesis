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

type StoredPatient = Omit<Patient, "createdAt"> & {
  createdAt?: string;
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

  if (!Array.isArray(value.anamneses)) {
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

const migrateToVersion1 = (patients: StoredPatient[]): Patient[] => {
  const migrationDate = new Date().toISOString();

  return patients.map((patient) => ({
    ...patient,

    createdAt: patient.createdAt || migrationDate,

    anamneses: patient.anamneses,
  }));
};

const migratePatients = (
  patients: StoredPatient[],
  fromVersion: number,
): Patient[] => {
  if (fromVersion < 1) {
    return migrateToVersion1(patients);
  }

  /*
   * Защитная нормализация.
   *
   * Даже у данных версии 1 createdAt
   * может отсутствовать, если localStorage
   * редактировался вручную или был создан
   * промежуточной версией приложения.
   */
  return patients.map((patient) => ({
    ...patient,

    createdAt: patient.createdAt || new Date().toISOString(),

    anamneses: patient.anamneses,
  }));
};

const persistMigration = (patients: Patient[]): void => {
  try {
    /*
     * Сначала записываем сами данные.
     * Только потом версию схемы.
     */
    writeJsonStorage(PATIENTS_STORAGE_KEY, patients);

    try {
      writeJsonStorage(PATIENTS_STORAGE_VERSION_KEY, PATIENTS_STORAGE_VERSION);
    } catch (error) {
      /*
       * Основные данные уже записаны.
       * Отсутствие номера версии не должно
       * делать чтение данных невозможным.
       *
       * При следующем запуске миграция
       * просто выполнится повторно.
       */
      console.warn(
        "Данные пациентов мигрированы, но не удалось сохранить номер версии схемы.",
        error,
      );
    }
  } catch (error) {
    /*
     * Ошибка автосохранения миграции
     * не должна превращать чтение данных
     * в ошибку приложения.
     *
     * В памяти используем уже
     * нормализованную структуру.
     */
    console.warn(
      "Не удалось записать мигрированные данные пациентов в localStorage.",
      error,
    );
  }
};

export const readPatientsStorage = (): Patient[] => {
  const patients = readJsonStorage<StoredPatient[]>(
    PATIENTS_STORAGE_KEY,
    [],
    isStoredPatientsArray,
  );

  const version = readStorageVersion();

  /*
   * Более новую структуру читаем
   * максимально осторожно, но
   * автоматически не перезаписываем.
   */
  if (version > PATIENTS_STORAGE_VERSION) {
    console.warn(
      `patientsData имеет более новую версию схемы (${version}), чем поддерживает приложение (${PATIENTS_STORAGE_VERSION}).`,
    );

    return patients.map((patient) => ({
      ...patient,

      createdAt: patient.createdAt || new Date().toISOString(),

      anamneses: patient.anamneses,
    }));
  }

  const migratedPatients = migratePatients(patients, version);

  /*
   * Пустое хранилище не создаём
   * только из-за открытия приложения.
   */
  if (patients.length === 0) {
    return migratedPatients;
  }

  if (version !== PATIENTS_STORAGE_VERSION) {
    persistMigration(migratedPatients);
  }

  return migratedPatients;
};

export const writePatientsStorage = (patients: Patient[]): void => {
  const currentStoredVersion = readStorageVersion();

  /*
   * Если данные уже открывались более новой
   * версией приложения, старая версия
   * не имеет права перезаписать их своей
   * схемой.
   */
  if (currentStoredVersion > PATIENTS_STORAGE_VERSION) {
    throw new StorageWriteError("incompatible-version", PATIENTS_STORAGE_KEY);
  }

  /*
   * Если эта запись завершилась ошибкой,
   * исключение обязательно уходит наверх:
   * UI не должен показать "Сохранено".
   */
  writeJsonStorage(PATIENTS_STORAGE_KEY, patients);

  /*
   * Основные данные уже успешно записаны.
   * Ошибка записи технического номера
   * версии не означает потерю изменений.
   */
  try {
    writeJsonStorage(PATIENTS_STORAGE_VERSION_KEY, PATIENTS_STORAGE_VERSION);
  } catch (error) {
    console.warn(
      "Данные сохранены, но не удалось записать номер версии схемы.",
      error,
    );
  }
};
