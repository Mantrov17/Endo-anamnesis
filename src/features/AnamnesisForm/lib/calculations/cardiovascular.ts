export const calculatePulsePressure = (
  systolic: number | null | undefined,
  diastolic: number | null | undefined,
): number | null => {
  if (!systolic || !diastolic) {
    return null;
  }

  return systolic - diastolic;
};

export const calculateAbi = (
  legSystolic: number | null | undefined,
  armSystolic: number | null | undefined,
): number | null => {
  if (!legSystolic || !armSystolic) {
    return null;
  }

  return +(legSystolic / armSystolic).toFixed(2);
};
