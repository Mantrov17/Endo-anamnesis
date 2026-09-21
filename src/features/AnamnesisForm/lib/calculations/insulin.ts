interface InsulinDoseItem {
  dose?: string | number | null;
}

const calculateDoseSum = (items: InsulinDoseItem[] | undefined): number => {
  return (
    items?.reduce((sum, item) => {
      const dose = parseFloat(String(item?.dose ?? "").replace(",", "."));

      return sum + (isNaN(dose) ? 0 : dose);
    }, 0) ?? 0
  );
};

export const calculateDailyInsulinDose = (
  basalInsulin: InsulinDoseItem[] | undefined,
  bolusInsulin: InsulinDoseItem[] | undefined,
  height: number | null | undefined,
  coefficient: number | null | undefined,
): number | null => {
  const basalDose = calculateDoseSum(basalInsulin);

  const bolusDose = calculateDoseSum(bolusInsulin);

  const totalDose = basalDose + bolusDose;

  if (totalDose > 0) {
    return +totalDose.toFixed(1);
  }

  if (height && coefficient) {
    const idealMass = Math.pow(height / 100, 2) * 19;

    return +(idealMass * coefficient).toFixed(1);
  }

  return null;
};

export const calculateInsulinDoseCoefficient = (
  diseaseDuration: number | null | undefined,
): number | null => {
  if (diseaseDuration === null || diseaseDuration === undefined) {
    return null;
  }

  const duration = Number(diseaseDuration);

  if (isNaN(duration)) {
    return null;
  }

  if (duration < 5) {
    return 0.5;
  }

  if (duration <= 10) {
    return 0.7;
  }

  return 0.9;
};
