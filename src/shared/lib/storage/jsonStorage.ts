export const readJsonStorage = <T>(key: string, fallback: T): T => {
  const stored = localStorage.getItem(key);

  if (!stored) {
    return fallback;
  }

  return JSON.parse(stored) as T;
};

export const writeJsonStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};
