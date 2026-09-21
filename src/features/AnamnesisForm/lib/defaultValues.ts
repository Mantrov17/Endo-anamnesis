import type { AnamnesisFormData } from "@/shared";

import {
  createActualTherapyDefaults,
  createTherapyDefaults,
} from "./defaults/therapyDefaults";

import {
  createHypoglycemiaDefaults,
  createSelfMonitoringDefaults,
} from "./defaults/diabetesCareDefaults";

import { createPrimaryExamDefaults } from "./defaults/primaryExamDefaults";
import { createComplicationsDefaults } from "./defaults/complicationsDefaults";
import { createExaminationDefaults } from "./defaults/examinationDefaults";
import { createLifestyleDefaults } from "./defaults/lifestyleDefaults";
import { createMeasurementsDefaults } from "./defaults/measurementsDefaults";

import { createSecondaryHypertensionDefaults } from "./defaults/secondaryHypertensionDefaults";

import {
  createH2FPEFDefaults,
  createHeartFailureDefaults,
} from "./defaults/heartFailureDefaults";

import { createAdditionalHistoryDefaults } from "./defaults/additionalHistoryDefaults";

export const getDefaultValues = (): AnamnesisFormData => ({
  fullName: "",
  birthDate: "",
  gender: undefined,

  notes: {},

  primaryExam: createPrimaryExamDefaults(),

  /*
   * СД1 и СД2 намеренно null.
   *
   * Их полные структуры создаются только
   * после выбора соответствующего диагноза
   * через diabetesDefaults.ts.
   */
  type1Diabetes: null,
  type2Diabetes: null,

  actualTherapy: createActualTherapyDefaults(),

  therapy: createTherapyDefaults(),

  hypoglycemia: createHypoglycemiaDefaults(),

  selfMonitoring: createSelfMonitoringDefaults(),

  complications: createComplicationsDefaults(),

  examination: createExaminationDefaults(),

  lifestyle: createLifestyleDefaults(),

  measurements: createMeasurementsDefaults(),

  secondaryHypertension: createSecondaryHypertensionDefaults(),

  heartFailure: createHeartFailureDefaults(),

  h2fpef: createH2FPEFDefaults(),

  additionalHistory: createAdditionalHistoryDefaults(),
});
