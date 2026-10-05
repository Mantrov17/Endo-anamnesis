import type { AnamnesisFormData, AnamnesisRecord } from "@/entities/anamnesis";

import { getDefaultValues } from "./defaultValues";

import {
  createType1DiabetesDefaults,
  createType2DiabetesDefaults,
} from "./diabetesDefaults";

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Поддержка старых записей.
 *
 * Ранее некоторые boolean-поля могли оказаться
 * сохранены как строки "true" / "false".
 *
 * Преобразование выполняем только в тех местах,
 * где default имеет boolean/null-семантику.
 *
 * Благодаря этому обычные текстовые поля со строками
 * не затрагиваются.
 */
const normalizeBooleanString = (
  defaultValue: unknown,
  sourceValue: unknown,
): unknown => {
  const canBeBoolean =
    defaultValue === null || typeof defaultValue === "boolean";

  if (!canBeBoolean) {
    return sourceValue;
  }

  if (sourceValue === "true") {
    return true;
  }

  if (sourceValue === "false") {
    return false;
  }

  return sourceValue;
};

const deepMergeWithDefaults = <T>(defaults: T, source: unknown): T => {
  const normalizedSource = normalizeBooleanString(defaults, source);

  if (Array.isArray(defaults)) {
    return (Array.isArray(normalizedSource) ? normalizedSource : defaults) as T;
  }

  if (isPlainObject(defaults)) {
    if (!isPlainObject(normalizedSource)) {
      return defaults;
    }

    const result: Record<string, unknown> = {
      ...defaults,
    };

    for (const key of Object.keys(defaults)) {
      result[key] = deepMergeWithDefaults(defaults[key], normalizedSource[key]);
    }

    /**
     * Не выбрасываем неизвестные старые/новые поля.
     *
     * Это важно для обратной совместимости:
     * если схема изменилась, но поле ещё отсутствует
     * в defaults текущей версии, данные пользователя
     * всё равно сохраняются.
     */
    for (const key of Object.keys(normalizedSource)) {
      if (!(key in defaults)) {
        result[key] = normalizedSource[key];
      }
    }

    return result as T;
  }

  return (normalizedSource !== undefined ? normalizedSource : defaults) as T;
};

/**
 * Проверяем, были ли в старой версии реально
 * заполнены какие-либо данные по гипогликемиям.
 *
 * Это нужно потому, что раньше вопроса
 * "Были ли понижения глюкозы менее 3,9 ммоль/л?"
 * не существовало.
 */
const hasLegacyHypoglycemiaData = (
  hypoglycemia: AnamnesisFormData["hypoglycemia"],
): boolean => {
  if (!hypoglycemia) {
    return false;
  }

  return Boolean(
    hypoglycemia.frequencyPerWeek !== null ||
      hypoglycemia.severeEpisodes !== null ||
      hypoglycemia.severeEpisodesCount !== null ||
      hypoglycemia.severeEpisodesWhen.trim() ||
      hypoglycemia.severeEpisodesClinic.trim() ||
      hypoglycemia.awarenessPreserved !== null ||
      hypoglycemia.provokingFactors.physicalActivity ||
      hypoglycemia.provokingFactors.missedMeal ||
      hypoglycemia.provokingFactors.alcohol ||
      hypoglycemia.hasGlucagon !== null ||
      hypoglycemia.familyTrained !== null ||
      hypoglycemia.nocturnalHypoglycemia !== null ||
      hypoglycemia.severity !== "" ||
      hypoglycemia.symptoms.hunger ||
      hypoglycemia.symptoms.tremor ||
      hypoglycemia.symptoms.sweating ||
      hypoglycemia.symptoms.tachycardia ||
      hypoglycemia.symptoms.anxiety ||
      hypoglycemia.symptoms.weakness ||
      hypoglycemia.symptoms.diplopia ||
      hypoglycemia.symptoms.headache,
  );
};

/**
 * Миграция старых записей гипогликемий.
 *
 * Если новое поле уже существует —
 * ничего не меняем.
 *
 * Если поля нет, но старая анкета была
 * заполнена — считаем ответ "Да".
 *
 * Если старая анкета была полностью пустой —
 * оставляем null, чтобы пользователь сам
 * выбрал "Да" или "Нет".
 */
const normalizeLegacyHypoglycemia = (
  data: AnamnesisFormData,
): AnamnesisFormData => {
  if (!data.hypoglycemia) {
    return data;
  }

  const rawHypoglycemia = data.hypoglycemia as typeof data.hypoglycemia & {
    hasGlucoseBelow39?: boolean | null;
  };

  if (rawHypoglycemia.hasGlucoseBelow39 !== undefined) {
    return data;
  }

  return {
    ...data,

    hypoglycemia: {
      ...data.hypoglycemia,

      hasGlucoseBelow39: hasLegacyHypoglycemiaData(data.hypoglycemia)
        ? true
        : null,
    },
  };
};

/**
 * Создаём defaults с учётом выбранных типов диабета.
 *
 * В основном getDefaultValues():
 *
 * type1Diabetes = null
 * type2Diabetes = null
 *
 * Это правильно для новой формы, но недостаточно
 * для deep merge уже существующего анамнеза.
 *
 * Если в записи существует объект СД1/СД2,
 * подставляем полноценную структуру соответствующего
 * типа и уже с ней выполняем deep merge.
 */
const getDefaultsForData = (data: AnamnesisFormData): AnamnesisFormData => {
  const defaults = getDefaultValues();

  if (data.type1Diabetes) {
    defaults.type1Diabetes = createType1DiabetesDefaults();
  }

  if (data.type2Diabetes) {
    defaults.type2Diabetes = createType2DiabetesDefaults();
  }

  return defaults;
};

export const mergeAnamnesisWithDefaults = (
  data: AnamnesisFormData,
): AnamnesisFormData => {
  const normalizedData = normalizeLegacyHypoglycemia(data);

  const defaults = getDefaultsForData(normalizedData);

  return deepMergeWithDefaults(defaults, normalizedData);
};

export const normalizeAnamnesisFormData = (
  record: AnamnesisRecord,
): AnamnesisFormData => {
  const { id: _id, savedAt: _savedAt, ...formData } = record;

  return mergeAnamnesisWithDefaults(formData);
};
