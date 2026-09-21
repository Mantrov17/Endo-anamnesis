import type { AnamnesisFormData } from "@/shared";

type ExaminationDefaults = NonNullable<AnamnesisFormData["examination"]>;

export const createExaminationDefaults = (): ExaminationDefaults => ({
  cardiovascularEvents: "",
  bloodPressure: "",

  otherChronicDiseases: "",
  currentMedications: "",

  allergies: "",
  hospitalizations: "",
  vaccinations: "",

  thyroidDisease: null,
  celiacDisease: null,
  otherAutoimmune: "",

  familyHistory: "",

  pregnancies: null,
  births: null,
  menstrualCycle: "",
});
