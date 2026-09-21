import type { AnamnesisFormData } from "@/shared";

type SecondaryHypertensionDefaults = NonNullable<
  AnamnesisFormData["secondaryHypertension"]
>;

export const createSecondaryHypertensionDefaults =
  (): SecondaryHypertensionDefaults => ({
    nsaidsFrequency: "",
    decongestantsFrequency: "",
    otherDrugs: "",

    hyperaldosteronism: {
      polydipsiaPolyuria: null,
      muscleWeakness: null,
      limbCramps: null,
      constipation: null,
    },

    frequentHeadaches: null,

    stroke: null,
    tia: null,
    tiaDetails: "",

    pheochromocytoma: {
      stableOrCrisis: "",
      profuseSweating: null,
      coldExtremities: null,
      arrhythmias: null,
    },

    hypercortisolism: {
      centralObesity: null,
      moonFace: null,
      cheekFlush: null,
      buffaloHump: null,
      bruises: null,
      proximalWeakness: null,
      striae: null,
      newDiabetes: null,
      amenorrhea: null,
    },

    osas: {
      nightSnoring: null,
      nightAwakenings: null,
      nocturia: null,
      daytimeSleepiness: null,
      obesity: null,
    },

    familyHistory: {
      hypertension: null,
      earlyHeartAttackStroke: null,
      pheochromocytoma: null,
    },

    pregnancyHypertension: null,
  });
