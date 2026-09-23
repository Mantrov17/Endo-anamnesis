export type StorageWriteErrorReason =
  | "quota"
  | "serialization"
  | "unavailable"
  | "incompatible-version";

export class StorageWriteError extends Error {
  readonly reason: StorageWriteErrorReason;

  readonly storageKey: string;

  readonly originalError?: unknown;

  constructor(
    reason: StorageWriteErrorReason,
    storageKey: string,
    originalError?: unknown,
  ) {
    super(`Не удалось записать данные в localStorage "${storageKey}".`);

    this.name = "StorageWriteError";
    this.reason = reason;
    this.storageKey = storageKey;
    this.originalError = originalError;
  }
}

type JsonValidator<T> = (value: unknown) => value is T;

const getInvalidBackupKey = (key: string): string => {
  return `${key}__invalid_backup`;
};

const preserveInvalidStorageValue = (key: string, value: string): void => {
  try {
    const backupKey = getInvalidBackupKey(key);

    /*
     * Первую повреждённую версию сохраняем
     * отдельно и больше не перезаписываем.
     */
    if (localStorage.getItem(backupKey) !== null) {
      return;
    }

    localStorage.setItem(backupKey, value);
  } catch (error) {
    console.error(
      `Не удалось сохранить резервную копию повреждённого localStorage "${key}".`,
      error,
    );
  }
};

const getErrorName = (error: unknown): string => {
  if (typeof error !== "object" || error === null || !("name" in error)) {
    return "";
  }

  return String(error.name);
};

const isQuotaExceededError = (error: unknown): boolean => {
  const errorName = getErrorName(error);

  return (
    errorName === "QuotaExceededError" ||
    errorName === "NS_ERROR_DOM_QUOTA_REACHED"
  );
};

export const readJsonStorage = <T>(
  key: string,
  fallback: T,
  validate?: JsonValidator<T>,
): T => {
  let stored: string | null;

  try {
    stored = localStorage.getItem(key);
  } catch (error) {
    console.error(`Не удалось прочитать localStorage "${key}".`, error);

    return fallback;
  }

  if (!stored) {
    return fallback;
  }

  try {
    const parsed: unknown = JSON.parse(stored);

    if (validate && !validate(parsed)) {
      console.error(
        `Данные localStorage "${key}" имеют некорректную структуру.`,
      );

      preserveInvalidStorageValue(key, stored);

      return fallback;
    }

    return parsed as T;
  } catch (error) {
    console.error(`Не удалось разобрать JSON из localStorage "${key}".`, error);

    preserveInvalidStorageValue(key, stored);

    return fallback;
  }
};

export const writeJsonStorage = <T>(key: string, value: T): void => {
  let serialized: string;

  try {
    const result = JSON.stringify(value);

    if (result === undefined) {
      throw new Error("JSON.stringify вернул undefined");
    }

    serialized = result;
  } catch (error) {
    throw new StorageWriteError("serialization", key, error);
  }

  try {
    localStorage.setItem(key, serialized);
  } catch (error) {
    throw new StorageWriteError(
      isQuotaExceededError(error) ? "quota" : "unavailable",
      key,
      error,
    );
  }
};

export const getStorageWriteErrorMessage = (error: unknown): string => {
  if (!(error instanceof StorageWriteError)) {
    return "Не удалось сохранить данные. Изменения не были записаны.";
  }

  switch (error.reason) {
    case "quota":
      return "Недостаточно места в хранилище браузера. Данные не были сохранены. Освободите место или скачайте бэкап перед дальнейшей работой.";

    case "serialization":
      return "Не удалось подготовить данные к сохранению. Изменения не были записаны.";

    case "unavailable":
      return "Браузер не разрешил сохранить данные в локальное хранилище. Проверьте настройки браузера и доступность localStorage.";

    case "incompatible-version":
      return "Данные были сохранены более новой версией приложения. Запись заблокирована, чтобы не повредить существующие данные.";
  }
};
