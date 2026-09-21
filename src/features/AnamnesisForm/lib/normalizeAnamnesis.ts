import type { AnamnesisFormData, AnamnesisRecord } from "@/shared";

import { getDefaultValues } from "./defaultValues";

type UnknownRecord = Record<string, unknown>;

const isPlainObject = (value: unknown): value is UnknownRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Рекурсивно объединяет актуальные defaultValues
 * с существующими данными анамнеза.
 *
 * Правила:
 *
 * 1. Если значения в source нет (undefined),
 *    используется значение из defaults.
 *
 * 2. Вложенные объекты объединяются рекурсивно.
 *
 * 3. Массивы не объединяются поэлементно.
 *    Сохранённый массив полностью заменяет массив из defaults.
 *
 * 4. false, 0, "", null считаются реальными значениями
 *    и не заменяются default-значениями.
 *
 * 5. Если в source есть неизвестное новое/старое поле,
 *    оно сохраняется.
 */
const deepMergeWithDefaults = <T>(defaults: T, source: unknown): T => {
  if (source === undefined) {
    return defaults;
  }

  /*
   * Массивы специально НЕ deep merge'им.
   *
   * Например:
   *
   * currentDrugs: [
   *   { name: "Метформин", dose: "1000" },
   *   { name: "..." }
   * ]
   *
   * Попытка рекурсивно объединять массивы по индексам
   * могла бы создать повреждённый список препаратов.
   */
  if (Array.isArray(defaults)) {
    return (Array.isArray(source) ? source : defaults) as T;
  }

  /*
   * Если default представляет объект,
   * объединяем его поля рекурсивно.
   */
  if (isPlainObject(defaults)) {
    /*
     * Если старые данные содержат некорректное значение
     * вместо ожидаемого объекта, например:
     *
     * complications: null
     *
     * безопаснее восстановить структуру из defaults.
     */
    if (!isPlainObject(source)) {
      return defaults;
    }

    const result: UnknownRecord = {
      ...defaults,
    };

    Object.entries(source).forEach(([key, sourceValue]) => {
      const defaultValue = result[key];

      /*
       * Поля, которых пока нет в defaults,
       * не удаляем.
       */
      if (defaultValue === undefined) {
        result[key] = sourceValue;
        return;
      }

      result[key] = deepMergeWithDefaults(defaultValue, sourceValue);
    });

    return result as T;
  }

  /*
   * Для обычных значений:
   * string, number, boolean, null и т. д.
   *
   * сохранённое значение имеет приоритет.
   */
  return source as T;
};

/**
 * Достраивает AnamnesisFormData до актуальной структуры формы.
 *
 * Используется:
 * - перед передачей данных в useForm;
 * - перед сохранением формы.
 */
export const mergeAnamnesisWithDefaults = (
  data: AnamnesisFormData,
): AnamnesisFormData => deepMergeWithDefaults(getDefaultValues(), data);

/**
 * Преобразует сохранённый AnamnesisRecord
 * в данные формы.
 *
 * id и savedAt относятся к записи в localStorage,
 * а не непосредственно к значениям формы,
 * поэтому в useForm они не передаются.
 */
export const normalizeAnamnesisFormData = (
  record: AnamnesisRecord,
): AnamnesisFormData => {
  const { id: _id, savedAt: _savedAt, ...formData } = record;

  return mergeAnamnesisWithDefaults(formData);
};
