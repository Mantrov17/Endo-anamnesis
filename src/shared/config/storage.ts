export const PATIENTS_STORAGE_KEY = "patientsData";

export const PATIENTS_STORAGE_VERSION_KEY = "patientsDataSchemaVersion";

/*
 * Версия 1:
 * - Patient.createdAt гарантирован;
 * - Patient.anamneses — массив анамнезов.
 *
 * Версия 2:
 * - вместо массива anamneses появился
 *   единственный primaryAnamnesis.
 *
 * Версия 3:
 * - появился массив diaryEntries.
 *
 * Версия 4:
 * - появился единственный glycemicProfile.
 *
 * Версия 5:
 * - появился отдельный массив plans;
 * - в дневник добавлено поле pulse;
 * - plannedActivities больше не является
 *   активным полем формы дневника и
 *   сохраняется только для совместимости
 *   со старыми данными.
 */
export const PATIENTS_STORAGE_VERSION = 5;
