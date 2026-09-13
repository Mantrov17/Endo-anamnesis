// Рекурсивная нормализация строк "true"/"false" в boolean
export function normalizeBooleanFields<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(normalizeBooleanFields) as T;
  }
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const value = (obj as Record<string, unknown>)[key];
    if (typeof value === "string" && (value === "true" || value === "false")) {
      result[key] = value === "true";
    } else if (typeof value === "object" && value !== null) {
      result[key] = normalizeBooleanFields(value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}
