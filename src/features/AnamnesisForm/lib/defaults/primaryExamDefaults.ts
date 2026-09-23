import type { AnamnesisFormData } from "@/entities/anamnesis";

type PrimaryExamDefaults = NonNullable<AnamnesisFormData["primaryExam"]>;

export const createPrimaryExamDefaults = (): PrimaryExamDefaults => ({
  reason: "",
  suspectedDiagnosis: undefined,

  height: null,
  weight: null,
  bmi: null,
  waistCircumference: null,

  weightChange6Months: null,
  weightIncreasedBy: null,
  weightDecreasedBy: null,
  weightChangeReason: "",
});
