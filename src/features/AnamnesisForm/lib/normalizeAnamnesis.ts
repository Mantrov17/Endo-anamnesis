import type { AnamnesisFormData, AnamnesisRecord } from "@/entities/anamnesis";

import { getDefaultValues } from "./defaultValues";

import { createSelfMonitoringDefaults } from "./defaults/diabetesCareDefaults";

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

    /*
     * Не выбрасываем неизвестные старые/новые поля.
     *
     * Это важно для обратной совместимости.
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
 * Проверяем, были ли в старой версии
 * заполнены какие-либо данные по гипогликемиям.
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
      hypoglycemia.severeEpisodesWhen?.trim() ||
      hypoglycemia.severeEpisodesClinic?.trim() ||
      hypoglycemia.severeEpisodesDetails?.trim() ||
      hypoglycemia.reliefMethod?.trim() ||
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
 * Если новое поле уже существует,
 * ничего не меняем.
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
 * В прежней форме подробности тяжёлых гипогликемий
 * вводились в три отдельных поля.
 *
 * Если новое поле ещё отсутствует,
 * объединяем старые сведения в один текст.
 */
const normalizeLegacySevereEpisodes = (
  data: AnamnesisFormData,
): AnamnesisFormData => {
  const hypoglycemia = data.hypoglycemia;

  if (!hypoglycemia || hypoglycemia.severeEpisodesDetails !== undefined) {
    return data;
  }

  const previousDetails: string[] = [];

  if (hypoglycemia.severeEpisodesCount != null) {
    previousDetails.push(
      `Количество эпизодов: ${hypoglycemia.severeEpisodesCount}`,
    );
  }

  if (hypoglycemia.severeEpisodesWhen?.trim()) {
    previousDetails.push(`Когда: ${hypoglycemia.severeEpisodesWhen.trim()}`);
  }

  if (hypoglycemia.severeEpisodesClinic?.trim()) {
    previousDetails.push(
      `Клиника: ${hypoglycemia.severeEpisodesClinic.trim()}`,
    );
  }

  if (previousDetails.length === 0) {
    return data;
  }

  return {
    ...data,

    hypoglycemia: {
      ...hypoglycemia,

      severeEpisodesDetails: previousDetails.join("\n"),
    },
  };
};

/**
 * Перенос мест инъекций из СД 1 типа в Самоконтроль.
 *
 * Старый путь:
 * type1Diabetes.injectionSitesInfo.sites
 *
 * Новый общий путь:
 * selfMonitoring.injectionSites
 *
 * Копируем данные только если нового поля
 * ещё не было в сохранённой анкете.
 *
 * Старый объект type1Diabetes не изменяем,
 * чтобы сохранить совместимость с прежними данными.
 */
const normalizeLegacyInjectionSites = (
  data: AnamnesisFormData,
): AnamnesisFormData => {
  const legacySites = data.type1Diabetes?.injectionSitesInfo?.sites;

  if (!legacySites) {
    return data;
  }

  // Новое поле уже существует — ничего не перезаписываем.
  if (data.selfMonitoring?.injectionSites !== undefined) {
    return data;
  }

  return {
    ...data,

    selfMonitoring: {
      ...createSelfMonitoringDefaults(),

      ...data.selfMonitoring,

      // Не помечаем перенос остальных данных мест инъекций как выполненный.
      injectionSiteDetailsMigrated:
        data.selfMonitoring?.injectionSiteDetailsMigrated,

      injectionSites: {
        abdomen: legacySites.abdomen,
        thighs: legacySites.thighs,
        buttocks: legacySites.buttocks,
        lumbar: legacySites.lumbar,
        shoulders: legacySites.shoulders,
      },
    },
  };
};

/**
 * Перенос состояния мест инъекций и частоты смены из формы СД 1
 * в общий раздел «Самоконтроль».
 *
 * Данные переносятся однократно — метка предотвращает повторное
 * заполнение очищенного пользователем поля из старой копии.
 * Исходные поля type1Diabetes не удаляем для обратной совместимости.
 */
const normalizeLegacyInjectionSiteDetails = (
  data: AnamnesisFormData,
): AnamnesisFormData => {
  const legacyInfo = data.type1Diabetes?.injectionSitesInfo;

  if (
    !legacyInfo ||
    data.selfMonitoring?.injectionSiteDetailsMigrated === true
  ) {
    return data;
  }

  const monitoring = data.selfMonitoring;
  const existingCondition = monitoring?.injectionSiteCondition;
  const legacyLipo = legacyInfo.lipodystrophy;

  return {
    ...data,
    selfMonitoring: {
      ...createSelfMonitoringDefaults(),
      ...monitoring,

      // Если частоты уже введены в Самоконтроле — не перезаписываем их.
      needleChangeFrequency: monitoring?.needleChangeFrequency?.trim()
        ? monitoring.needleChangeFrequency
        : (legacyInfo.needleChangeFrequency ?? ""),

      injectionSiteChangeFrequency:
        monitoring?.injectionSiteChangeFrequency?.trim()
          ? monitoring.injectionSiteChangeFrequency
          : (legacyInfo.siteChangeFrequency ?? ""),

      injectionSiteCondition: {
        lipodystrophy: {
          lipohypertrophy:
            existingCondition?.lipodystrophy?.lipohypertrophy ??
            legacyLipo?.lipohypertrophy ??
            false,
          lipoatrophy:
            existingCondition?.lipodystrophy?.lipoatrophy ??
            legacyLipo?.lipoatrophy ??
            false,
          none:
            existingCondition?.lipodystrophy?.none ?? legacyLipo?.none ?? false,
        },
        tenderness:
          existingCondition?.tenderness ?? legacyInfo.tenderness ?? null,
        hyperemia: existingCondition?.hyperemia ?? null,
        skinTemperature:
          existingCondition?.skinTemperature ||
          legacyInfo.skinTemperature ||
          "",
      },

      injectionSiteDetailsMigrated: true,
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
 * Для существующих записей подставляем
 * соответствующие структуры перед deep merge.
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
  const normalizedData = normalizeLegacyInjectionSiteDetails(
    normalizeLegacyInjectionSites(
      normalizeLegacySevereEpisodes(normalizeLegacyHypoglycemia(data)),
    ),
  );

  const defaults = getDefaultsForData(normalizedData);

  return deepMergeWithDefaults(defaults, normalizedData);
};

export const normalizeAnamnesisFormData = (
  record: AnamnesisRecord,
): AnamnesisFormData => {
  const { id: _id, savedAt: _savedAt, ...formData } = record;

  return mergeAnamnesisWithDefaults(formData);
};
