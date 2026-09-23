import type { AnamnesisFormData } from "@/entities/anamnesis";

type ActualTherapyDefaults = NonNullable<AnamnesisFormData["actualTherapy"]>;

type TherapyDefaults = NonNullable<AnamnesisFormData["therapy"]>;

export const createActualTherapyDefaults = (): ActualTherapyDefaults => ({
  sameAsInitial: null,
  correctionReason: "",
  correctedTherapy: "",

  injectionMethod: "",
  injectionsDevice: "",
  pumpModel: "",

  basalInsulin: [
    {
      name: "",
      dose: "",
    },
  ],

  bolusInsulin: [
    {
      name: "",
      dose: "",
    },
  ],

  insulinDoseCoefficient: null,
  calculatedDailyInsulinDose: null,

  injectionSites: "",
  lipohypertrophy: null,
});

export const createTherapyDefaults = (): TherapyDefaults => ({
  targetHba1c: "",

  currentDrugs: [
    {
      name: "",
      dose: "",
    },
  ],

  basalInsulin: [
    {
      name: "",
      dose: "",
    },
  ],

  prandialInsulin: [
    {
      name: "",
      dose: "",
    },
  ],
});
