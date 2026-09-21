export const calculateBmi = (
  height: number | null | undefined,
  weight: number | null | undefined,
): number | null => {
  if (!height || !weight || height <= 0) {
    return null;
  }

  return +(weight / Math.pow(height / 100, 2)).toFixed(1);
};
