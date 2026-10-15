import type { AnamnesisFormData } from "@/entities/anamnesis";

import { getPatientById } from "@/entities/patient";

import {
  readJsonStorage,
  writeJsonStorage,
} from "@/shared/lib/storage/jsonStorage";

import { mergeAnamnesisWithDefaults } from "./normalizeAnamnesis";

const DRAFT_SCHEMA_VERSION = 1;
const DRAFT_KEY_PREFIX = "endoAnamnesisDraft:v1:";

interface AnamnesisDraft {
  version: number;
  patientId: string;
  updatedAt: string;
  data: AnamnesisFormData;
}

const getDraftKey = (patientId: string): string =>
  `${DRAFT_KEY_PREFIX}${patientId}`;

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isAnamnesisDraft = (value: unknown): value is AnamnesisDraft => {
  if (!isPlainObject(value)) {
    return false;
  }

  return (
    value.version === DRAFT_SCHEMA_VERSION &&
    typeof value.patientId === "string" &&
    typeof value.updatedAt === "string" &&
    Number.isFinite(Date.parse(value.updatedAt)) &&
    isPlainObject(value.data)
  );
};

/**
 * Получаем начальные данные формы.
 *
 * Если черновик новее официально сохранённого
 * анамнеза, используем его.
 *
 * Иначе используем данные официального анамнеза.
 *
 * В обоих случаях выполняем существующую
 * нормализацию и добавление значений по умолчанию.
 */
export const getInitialAnamnesisData = (
  patientId: string,
  initialData?: AnamnesisFormData,
): AnamnesisFormData => {
  const patient = getPatientById(patientId);

  const draft = readJsonStorage<AnamnesisDraft | null>(
    getDraftKey(patientId),
    null,
    (value): value is AnamnesisDraft | null =>
      value === null || isAnamnesisDraft(value),
  );

  if (draft && draft.patientId === patientId) {
    const savedAt = patient?.primaryAnamnesis?.savedAt;

    const savedTimestamp = savedAt ? Date.parse(savedAt) : NaN;

    const draftTimestamp = Date.parse(draft.updatedAt);

    if (!Number.isFinite(savedTimestamp) || draftTimestamp > savedTimestamp) {
      return mergeAnamnesisWithDefaults(draft.data);
    }
  }

  return mergeAnamnesisWithDefaults(initialData ?? {});
};

/**
 * Автосохранение черновика.
 *
 * Не меняет основной объект пациента.
 * Не создаёт дополнительный первичный анамнез.
 */
export const saveAnamnesisDraft = (
  patientId: string,
  data: AnamnesisFormData,
): void => {
  const draft: AnamnesisDraft = {
    version: DRAFT_SCHEMA_VERSION,
    patientId,
    updatedAt: new Date().toISOString(),
    data,
  };

  writeJsonStorage(getDraftKey(patientId), draft);
};

/**
 * Вызывается только после успешного
 * официального сохранения анамнеза.
 */
export const clearAnamnesisDraft = (patientId: string): void => {
  localStorage.removeItem(getDraftKey(patientId));
};
