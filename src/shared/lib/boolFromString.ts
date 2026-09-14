export const boolFromString = (v: unknown): boolean | null => {
  if (v === true || v === "true") return true;
  if (v === false || v === "false") return false;
  return null;
};
