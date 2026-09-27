export const PATIENTS_STORAGE_KEY = "patientsData";

export const PATIENTS_STORAGE_VERSION_KEY = "patientsDataSchemaVersion";

/*
 * Версия 1:
 * - Patient.createdAt гарантирован;
 * - Patient.anamneses — массив анамнезов.
 *
 * Версия 2:
 * - массив anamneses удалён;
 * - появился primaryAnamnesis.
 *
 * Версия 3:
 * - появился массив diaryEntries.
 *
 * Версия 4:
 * - появился единственный glycemicProfile.
 */
export const PATIENTS_STORAGE_VERSION = 4;
