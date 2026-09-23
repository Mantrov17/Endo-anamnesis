export const PATIENTS_STORAGE_KEY = "patientsData";

export const PATIENTS_STORAGE_VERSION_KEY = "patientsDataSchemaVersion";

/*
 * Версия структуры данных, хранящихся
 * в patientsData.
 *
 * Версия 1:
 * - Patient.createdAt гарантирован;
 * - Patient.anamneses гарантирован как массив.
 *
 * Сам patientsData по-прежнему остаётся
 * обычным массивом пациентов.
 */
export const PATIENTS_STORAGE_VERSION = 1;
