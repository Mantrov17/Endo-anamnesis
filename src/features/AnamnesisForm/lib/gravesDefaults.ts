import type { GravesDisease } from "@/entities/anamnesis";

export const createGravesDiseaseDefaults = (): GravesDisease => ({
  firstSymptomsDate: "",
  clinicalManifestations: [],
  visitedEndocrinologist: null,
  endocrinologistVisitDate: "",
  diagnosisDate: "",
});
