interface H2FPEFValues {
  obesityBMI30: boolean;
  hypertension2Drugs: boolean;
  atrialFibrillation: boolean;
  pulmonaryHypertension: boolean;
  elderly60: boolean;
  fillingPressure: boolean;
}

export const calculateH2FPEFScore = (values: H2FPEFValues): number => {
  return (
    (values.obesityBMI30 ? 2 : 0) +
    (values.hypertension2Drugs ? 1 : 0) +
    (values.atrialFibrillation ? 3 : 0) +
    (values.pulmonaryHypertension ? 1 : 0) +
    (values.elderly60 ? 1 : 0) +
    (values.fillingPressure ? 1 : 0)
  );
};
